#!/usr/bin/env python3
"""drawio → 인터랙티브 뷰어용 맵 JSON.

SVG 내보내기(data-cell-id 보존)와 짝을 이룬다. 뷰어(assets/js/drawio-view.js)가
이 맵으로 호버 시 연관 셀만 강조한다.

- edges: [{id, s, t}] — 엣지 셀 id와 (경유점을 관통한) 실제 양 끝 vertex id.
    라벨 없는 12px 이하의 미세한 degree-2 vertex(선 꺾임용 보이지 않는 점)는 병합한다 —
    A→점→B 두 엣지 모두 s=A, t=B로 기록되어 어느 쪽에 호버해도 함께 켜진다.
- resolve: {cellId: effectiveId} — 호버 단위 결정.
    · 자신이 엣지를 가진 vertex → 자기 자신
    · 엣지 없는 vertex(컨테이너 안 불릿 등) → 엣지를 가진 가장 가까운 조상
    · 엣지 라벨 → 그 엣지
    · 조상이 없으면 → 20px 이내로 붙어 있는 "자식 없는 엣지 보유 vertex"에 페어링
      (AWS 아이콘 + 별도 텍스트 라벨 패턴 대응. 컨테이너는 페어링 대상에서 제외)
    · 어디에도 닿지 않는 셀(제목·범례·레인 프레임) → 맵에서 제외 = 장식 취급

사용: python3 scripts/drawio-map.py <in.drawio> <out.map.json>
"""
import sys
import json
import xml.etree.ElementTree as ET


def main(src, out):
    root = ET.parse(src).getroot()
    cells = {}
    for c in root.iter('mxCell'):
        geo = c.find('mxGeometry')
        cells[c.get('id')] = {
            'parent': c.get('parent'),
            'edge': c.get('edge') == '1',
            'vertex': c.get('vertex') == '1',
            'label': (c.get('value') or '').strip(),
            'source': c.get('source'),
            'target': c.get('target'),
            'x': float(geo.get('x', 0)) if geo is not None else 0.0,
            'y': float(geo.get('y', 0)) if geo is not None else 0.0,
            'w': float(geo.get('width', 0)) if geo is not None else 0.0,
            'h': float(geo.get('height', 0)) if geo is not None else 0.0,
        }

    def abs_pos(cid, depth=0):
        c = cells.get(cid)
        if not c or depth > 12:
            return (0.0, 0.0)
        if c['parent'] in cells:
            px, py = abs_pos(c['parent'], depth + 1)
            return (px + c['x'], py + c['y'])
        return (c['x'], c['y'])

    raw_edges = [
        {'id': cid, 's': c['source'], 't': c['target']}
        for cid, c in cells.items()
        if c['edge'] and c['source'] in cells and c['target'] in cells
    ]

    raw_degree = {}
    for e in raw_edges:
        raw_degree[e['s']] = raw_degree.get(e['s'], 0) + 1
        raw_degree[e['t']] = raw_degree.get(e['t'], 0) + 1

    # 보이지 않는 경유점: 라벨 없는 12px 이하 vertex이면서 정확히 엣지 2개가 지나간다.
    # (라벨 없는 아이콘 노드는 크기가 커서 여기 걸리지 않는다)
    passthrough = {
        cid for cid, c in cells.items()
        if c['vertex'] and not c['label'] and raw_degree.get(cid) == 2
        and c['w'] <= 12 and c['h'] <= 12
    }

    def follow(node, via_edge_id):
        prev = via_edge_id
        seen = set()
        while node in passthrough and node not in seen:
            seen.add(node)
            nxt = [e for e in raw_edges if e['id'] != prev and (e['s'] == node or e['t'] == node)]
            if len(nxt) != 1:
                break
            e = nxt[0]
            node = e['t'] if e['s'] == node else e['s']
            prev = e['id']
        return node

    edges = [
        {'id': e['id'], 's': follow(e['s'], e['id']), 't': follow(e['t'], e['id'])}
        for e in raw_edges
    ]

    degree = {}
    for e in edges:
        if e['s'] in passthrough or e['t'] in passthrough:
            continue
        degree[e['s']] = degree.get(e['s'], 0) + 1
        degree[e['t']] = degree.get(e['t'], 0) + 1

    has_children = set()
    for cid, c in cells.items():
        if c['vertex'] and c['parent'] in cells and cells[c['parent']]['vertex']:
            has_children.add(c['parent'])

    resolve = {}
    for cid, c in cells.items():
        if c['edge'] or cid in passthrough:
            continue
        cur, seen = cid, set()
        while cur in cells and cur not in seen:
            seen.add(cur)
            cc = cells[cur]
            if cc['edge']:
                resolve[cid] = cur  # 엣지 라벨 → 그 엣지
                break
            if degree.get(cur):
                resolve[cid] = cur  # 엣지를 가진 가장 가까운 self-or-ancestor
                break
            cur = cc['parent']

    # 근접 페어링: 여전히 장식인 vertex를, 20px 이내로 붙은 "자식 없는 엣지 보유 vertex"에 붙인다.
    anchors = [
        cid for cid in degree
        if cid in cells and cells[cid]['vertex'] and cid not in has_children
    ]
    anchor_rects = {}
    for aid in anchors:
        ax, ay = abs_pos(aid)
        anchor_rects[aid] = (ax, ay, ax + cells[aid]['w'], ay + cells[aid]['h'])

    GAP = 20.0
    paired = 0
    for cid, c in cells.items():
        if not c['vertex'] or cid in resolve or cid in passthrough or c['edge']:
            continue
        if cid in has_children:
            continue
        lx, ly = abs_pos(cid)
        rect = (lx, ly, lx + c['w'], ly + c['h'])
        best, best_gap = None, GAP + 1
        for aid, (ax1, ay1, ax2, ay2) in anchor_rects.items():
            dx = max(ax1 - rect[2], rect[0] - ax2, 0.0)
            dy = max(ay1 - rect[3], rect[1] - ay2, 0.0)
            # 한 축은 겹치고 다른 축의 간격이 GAP 이내여야 한다
            if (dx == 0.0 or dy == 0.0) and dx + dy <= GAP and dx + dy < best_gap:
                best, best_gap = aid, dx + dy
        if best:
            resolve[cid] = best
            paired += 1

    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'edges': edges, 'resolve': resolve}, f, ensure_ascii=False)
    print(f'{out} | cells {len(cells)} | edges {len(edges)} | passthrough {len(passthrough)} '
          f'| resolve {len(resolve)} (근접 페어링 {paired})')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
