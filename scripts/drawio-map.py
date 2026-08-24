#!/usr/bin/env python3
"""drawio → 인터랙티브 뷰어용 맵 JSON.

SVG 내보내기(data-cell-id 보존)와 짝을 이룬다. 뷰어(assets/js/drawio-view.js)가
이 맵으로 호버 시 연관 셀만 강조한다.

- edges: [{id, s, t}] — 엣지 셀 id와 (경유점을 관통한) 실제 양 끝 vertex id.
    라벨 없는 degree-2 vertex(선 꺾임용 보이지 않는 점)는 병합한다 —
    A→점→B 두 엣지 모두 s=A, t=B로 기록되어 어느 쪽에 호버해도 함께 켜진다.
- resolve: {cellId: effectiveId} — 호버 단위 결정.
    · 자신이 엣지를 가진 vertex → 자기 자신
    · 엣지 없는 vertex(컨테이너 안 불릿 등) → 엣지를 가진 가장 가까운 조상
    · 엣지 라벨 → 그 엣지
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
        cells[c.get('id')] = {
            'parent': c.get('parent'),
            'edge': c.get('edge') == '1',
            'vertex': c.get('vertex') == '1',
            'label': (c.get('value') or '').strip(),
            'source': c.get('source'),
            'target': c.get('target'),
        }

    raw_edges = [
        {'id': cid, 's': c['source'], 't': c['target']}
        for cid, c in cells.items()
        if c['edge'] and c['source'] in cells and c['target'] in cells
    ]

    raw_degree = {}
    for e in raw_edges:
        raw_degree[e['s']] = raw_degree.get(e['s'], 0) + 1
        raw_degree[e['t']] = raw_degree.get(e['t'], 0) + 1

    # 보이지 않는 경유점: 라벨 없는 vertex이면서 정확히 엣지 2개가 지나간다
    passthrough = {
        cid for cid, c in cells.items()
        if c['vertex'] and not c['label'] and raw_degree.get(cid) == 2
    }

    def follow(node, via_edge_id):
        """경유점 체인을 관통해 실제 끝 vertex를 찾는다."""
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

    resolve = {}
    merged = 0
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
                if cur != cid:
                    merged += 1
                break
            cur = cc['parent']

    with open(out, 'w', encoding='utf-8') as f:
        json.dump({'edges': edges, 'resolve': resolve}, f, ensure_ascii=False)
    print(f'{out} | cells {len(cells)} | edges {len(edges)} | passthrough {len(passthrough)} '
          f'| resolve {len(resolve)} (상속 {merged})')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
