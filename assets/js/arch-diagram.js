// WES 인터랙티브 아키텍처 다이어그램 렌더러
// - .wes-arch[data-arch] 요소를 찾아 window.WES_ARCH_DATA의 데이터로 렌더한다.
// - 노드 호버/포커스/탭: 연결된 노드·엣지만 강조하고 나머지는 흐림. 클릭으로 고정, Esc로 해제.
// - 추가로 mermaid 플로우차트(code.language-mermaid)에도 같은 호버 강조를 입힌다.
(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var EDGE_COLORS = { sync: '#525252', async: '#BD528B', data: '#a3a3a3', deploy: '#16a34a' };
  var EDGE_NAMES = { sync: '동기 요청', async: '비동기', data: '데이터 · 스토리지 I/O', deploy: '배포 경로' };

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function ArchDiagram(root, data) {
    this.root = root;
    this.data = data;
    this.nodeEls = {};
    this.edgeRecs = [];
    this.adj = {};
    this.hoverId = null;
    this.pinId = null;
    this.hoverEdge = null;
    this.build();
    this.wire();
    this.draw(); // 즉시 1차 렌더 — 백그라운드 탭에서는 rAF가 지연되거나 실행되지 않는다
  }

  ArchDiagram.prototype.build = function () {
    var d = this.data;
    var self = this;
    this.root.innerHTML = '';
    this.root.classList.add('wes-arch--ready');

    el('p', 'wes-arch__hint', this.root).textContent =
      '노드에 마우스를 올리면 연결된 요소만 강조됩니다 · 클릭하면 고정 · Esc 또는 빈 곳 클릭으로 해제';

    var scroll = el('div', 'wes-arch__scroll', this.root);
    var canvas = el('div', 'wes-arch__canvas', scroll);
    canvas.style.gridTemplateColumns = 'repeat(' + d.lanes.length + ', minmax(150px, 1fr))';
    if (d.minWidth) canvas.style.minWidth = d.minWidth + 'px';
    this.canvas = canvas;

    this.svg = svgEl('svg', { 'class': 'wes-arch__svg', 'aria-hidden': 'true' }, canvas);
    var defs = svgEl('defs', {}, this.svg);
    Object.keys(EDGE_COLORS).forEach(function (kind) {
      var m = svgEl('marker', {
        id: 'wes-arrow-' + kind, viewBox: '0 0 10 10', refX: '9', refY: '5',
        markerWidth: '7', markerHeight: '7', orient: 'auto-start-reverse'
      }, defs);
      svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: EDGE_COLORS[kind] }, m);
    });

    // 레인 → (그룹) → 노드
    d.lanes.forEach(function (lane) {
      var laneEl = el('div', 'wes-arch__lane', canvas);
      el('div', 'wes-arch__lane-title', laneEl).textContent = lane.title;
      var groups = (d.groups || []).filter(function (g) { return g.lane === lane.id; });
      groups.forEach(function (g) {
        var gEl = el('div', 'wes-arch__group', laneEl);
        el('div', 'wes-arch__group-title', gEl).textContent = g.title;
        d.nodes.filter(function (n) { return n.lane === lane.id && n.group === g.id; })
          .forEach(function (n) { self.buildNode(n, gEl); });
      });
      d.nodes.filter(function (n) { return n.lane === lane.id && !n.group; })
        .forEach(function (n) { self.buildNode(n, laneEl); });
    });

    // 엣지 (svg 그룹: 히트 영역 + 실제 선 + 라벨)
    d.edges.forEach(function (e) {
      var g = svgEl('g', { 'class': 'wes-arch__edge wes-arch__edge--' + e.kind + (e.status === 'planned' ? ' is-planned' : '') }, self.svg);
      var hit = svgEl('path', { 'class': 'wes-arch__ehit', fill: 'none' }, g);
      var path = svgEl('path', {
        'class': 'wes-arch__eline', fill: 'none', stroke: EDGE_COLORS[e.kind] || '#525252',
        'marker-end': 'url(#wes-arrow-' + (e.kind || 'sync') + ')'
      }, g);
      var label = null;
      if (e.label) {
        label = svgEl('text', { 'class': 'wes-arch__elabel', 'text-anchor': 'middle' }, g);
        label.textContent = e.label;
      }
      self.edgeRecs.push({ data: e, g: g, hit: hit, path: path, label: label });
      (self.adj[e.from] = self.adj[e.from] || {})[e.to] = true;
      (self.adj[e.to] = self.adj[e.to] || {})[e.from] = true;
    });

    // 범례
    var legend = el('div', 'wes-arch__legend', this.root);
    var kinds = {};
    d.edges.forEach(function (e) { kinds[e.kind] = true; });
    Object.keys(kinds).forEach(function (kind) {
      var item = el('span', 'wes-arch__legend-item', legend);
      var sw = el('span', 'wes-arch__legend-line wes-arch__legend-line--' + kind, item);
      sw.style.borderColor = EDGE_COLORS[kind];
      el('span', '', item).textContent = EDGE_NAMES[kind] || kind;
    });
    if (d.nodes.some(function (n) { return n.status === 'planned'; })) {
      var p = el('span', 'wes-arch__legend-item', legend);
      el('span', 'wes-arch__badge wes-arch__legend-badge', p).textContent = '예정';
      el('span', '', p).textContent = '목표 설계 (미구현)';
    }
  };

  ArchDiagram.prototype.buildNode = function (n, parent) {
    var nodeEl = el('div', 'wes-arch__node wes-arch__node--' + (n.kind || 'aws') + (n.status === 'planned' ? ' is-planned' : ''), parent);
    nodeEl.setAttribute('data-node', n.id);
    nodeEl.setAttribute('tabindex', '0');
    nodeEl.setAttribute('role', 'button');
    nodeEl.setAttribute('aria-pressed', 'false');
    nodeEl.setAttribute('aria-label', n.title + (n.desc ? ' — ' + n.desc : '') + (n.status === 'planned' ? ' (예정)' : ''));
    el('span', 'wes-arch__node-title', nodeEl).textContent = n.title;
    if (n.desc) el('span', 'wes-arch__node-desc', nodeEl).textContent = n.desc;
    if (n.status === 'planned') el('span', 'wes-arch__badge', nodeEl).textContent = '예정';
    this.nodeEls[n.id] = nodeEl;
  };

  ArchDiagram.prototype.rect = function (nodeEl) {
    var c = this.canvas.getBoundingClientRect();
    var r = nodeEl.getBoundingClientRect();
    return {
      l: r.left - c.left, t: r.top - c.top, r: r.right - c.left, b: r.bottom - c.top,
      cx: r.left - c.left + r.width / 2, cy: r.top - c.top + r.height / 2
    };
  };

  ArchDiagram.prototype.draw = function () {
    var self = this;
    var w = this.canvas.scrollWidth, h = this.canvas.scrollHeight;
    this.svg.setAttribute('width', w);
    this.svg.setAttribute('height', h);
    this.svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);

    this.edgeRecs.forEach(function (rec) {
      var s = self.nodeEls[rec.data.from], t = self.nodeEls[rec.data.to];
      if (!s || !t) return;
      var a = self.rect(s), b = self.rect(t), d;
      if (b.l >= a.r - 4) {                       // 정방향 (왼쪽 → 오른쪽)
        var k1 = Math.max((b.l - a.r) / 2, 32);
        d = 'M ' + a.r + ' ' + a.cy + ' C ' + (a.r + k1) + ' ' + a.cy + ', ' + (b.l - k1) + ' ' + b.cy + ', ' + b.l + ' ' + b.cy;
      } else if (a.l >= b.r - 4) {                // 역방향 (오른쪽 → 왼쪽)
        var k2 = Math.max((a.l - b.r) / 2, 32);
        d = 'M ' + a.l + ' ' + a.cy + ' C ' + (a.l - k2) + ' ' + a.cy + ', ' + (b.r + k2) + ' ' + b.cy + ', ' + b.r + ' ' + b.cy;
      } else {                                     // 같은 레인 → 오른쪽으로 볼록한 곡선
        var bulge = Math.max(a.r, b.r) + 30;
        d = 'M ' + a.r + ' ' + a.cy + ' C ' + bulge + ' ' + a.cy + ', ' + bulge + ' ' + b.cy + ', ' + b.r + ' ' + b.cy;
      }
      rec.path.setAttribute('d', d);
      rec.hit.setAttribute('d', d);
      if (rec.label) {
        var mid = rec.path.getPointAtLength(rec.path.getTotalLength() * 0.5);
        rec.label.setAttribute('x', mid.x);
        rec.label.setAttribute('y', mid.y - 7);
      }
    });
  };

  ArchDiagram.prototype.scheduleDraw = function () {
    var self = this;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._timer) clearTimeout(this._timer);
    this._raf = requestAnimationFrame(function () {
      clearTimeout(self._timer);
      self.draw();
    });
    // 백그라운드 탭 등 rAF가 멈춘 환경에서도 타임아웃으로 렌더를 보장한다
    this._timer = setTimeout(function () {
      cancelAnimationFrame(self._raf);
      self.draw();
    }, 150);
  };

  ArchDiagram.prototype.apply = function () {
    var self = this;
    var focusEdge = this.hoverEdge;
    var activeId = this.hoverId || this.pinId;
    var related = {};
    if (focusEdge) {
      related[focusEdge.data.from] = true;
      related[focusEdge.data.to] = true;
    } else if (activeId) {
      related[activeId] = true;
      var nbrs = this.adj[activeId] || {};
      Object.keys(nbrs).forEach(function (id) { related[id] = true; });
    }
    var hasFocus = focusEdge || activeId;
    this.root.classList.toggle('has-focus', !!hasFocus);

    Object.keys(this.nodeEls).forEach(function (id) {
      var e = self.nodeEls[id];
      e.classList.toggle('is-focus', !focusEdge && id === activeId);
      e.classList.toggle('is-related', !!hasFocus && !!related[id] && id !== activeId);
      e.classList.toggle('is-dim', !!hasFocus && !related[id]);
      e.setAttribute('aria-pressed', id === self.pinId ? 'true' : 'false');
    });
    this.edgeRecs.forEach(function (rec) {
      var on = focusEdge ? rec === focusEdge
        : (activeId && (rec.data.from === activeId || rec.data.to === activeId));
      rec.g.classList.toggle('is-related', !!hasFocus && !!on);
      rec.g.classList.toggle('is-dim', !!hasFocus && !on);
    });
  };

  ArchDiagram.prototype.wire = function () {
    var self = this;
    Object.keys(this.nodeEls).forEach(function (id) {
      var e = self.nodeEls[id];
      e.addEventListener('mouseenter', function () { self.hoverId = id; self.apply(); });
      e.addEventListener('mouseleave', function () { self.hoverId = null; self.apply(); });
      e.addEventListener('focus', function () { self.hoverId = id; self.apply(); });
      e.addEventListener('blur', function () { self.hoverId = null; self.apply(); });
      e.addEventListener('click', function (ev) {
        ev.stopPropagation();
        self.pinId = self.pinId === id ? null : id;
        self.apply();
      });
      e.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          self.pinId = self.pinId === id ? null : id;
          self.apply();
        }
      });
    });
    this.edgeRecs.forEach(function (rec) {
      rec.hit.addEventListener('mouseenter', function () { self.hoverEdge = rec; self.apply(); });
      rec.hit.addEventListener('mouseleave', function () { self.hoverEdge = null; self.apply(); });
    });
    this.root.addEventListener('click', function () { self.pinId = null; self.apply(); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { self.pinId = null; self.hoverId = null; self.hoverEdge = null; self.apply(); }
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function () { self.scheduleDraw(); }).observe(this.canvas);
    } else {
      window.addEventListener('resize', function () { self.scheduleDraw(); });
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { self.scheduleDraw(); });
    }
  };

  // ---- mermaid 플로우차트 호버 강조 --------------------------------------
  // mermaid가 비동기 렌더하므로 SVG가 생길 때까지 잠시 대기한 뒤 연결한다.
  function initMermaidHover() {
    var codes = document.querySelectorAll('code.language-mermaid');
    if (!codes.length) return;
    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var pending = false;
      codes.forEach(function (c) {
        if (c.getAttribute('data-wes-hover')) return;
        var svg = c.querySelector('svg');
        if (!svg) { pending = true; return; }
        c.setAttribute('data-wes-hover', '1');
        wireMermaid(svg);
      });
      if (!pending || tries > 40) clearInterval(timer);
    }, 250);
  }

  function wireMermaid(svg) {
    var nodes = Array.prototype.slice.call(svg.querySelectorAll('g.node'));
    var links = Array.prototype.slice.call(svg.querySelectorAll('path.flowchart-link'));
    if (!nodes.length || !links.length) return; // 플로우차트가 아니면 건드리지 않는다
    var labels = Array.prototype.slice.call(svg.querySelectorAll('.edgeLabel'));
    var pairLabels = labels.length === links.length;

    var idOf = function (n) {
      var m = (n.id || '').match(/^flowchart-(.+?)-\d+$/);
      return m ? m[1] : null;
    };
    var edges = links.map(function (p, i) {
      var cls = p.getAttribute('class') || '';
      var ls = (cls.match(/LS-([\w-]+)/) || [])[1];
      var le = (cls.match(/LE-([\w-]+)/) || [])[1];
      return { el: p, from: ls, to: le, label: pairLabels ? labels[i] : null };
    }).filter(function (e) { return e.from && e.to; });
    if (!edges.length) return;

    var all = nodes.concat(links).concat(labels);
    all.forEach(function (e) { e.style.transition = 'opacity .18s ease'; });

    function setFocus(id) {
      if (!id) {
        all.forEach(function (e) { e.style.opacity = ''; });
        return;
      }
      var related = {};
      related[id] = true;
      edges.forEach(function (e) {
        if (e.from === id) related[e.to] = true;
        if (e.to === id) related[e.from] = true;
      });
      nodes.forEach(function (n) {
        var nid = idOf(n);
        n.style.opacity = nid && related[nid] ? '1' : '0.12';
      });
      edges.forEach(function (e) {
        var on = e.from === id || e.to === id;
        e.el.style.opacity = on ? '1' : '0.06';
        if (e.label) e.label.style.opacity = on ? '1' : '0.06';
      });
      if (!pairLabels) labels.forEach(function (l) { l.style.opacity = '0.15'; });
    }

    nodes.forEach(function (n) {
      var nid = idOf(n);
      if (!nid) return;
      n.style.cursor = 'pointer';
      n.addEventListener('mouseenter', function () { setFocus(nid); });
      n.addEventListener('mouseleave', function () { setFocus(null); });
    });
  }

  function boot() {
    var roots = document.querySelectorAll('.wes-arch[data-arch]');
    roots.forEach(function (root) {
      var name = root.getAttribute('data-arch');
      var data = window.WES_ARCH_DATA && window.WES_ARCH_DATA[name];
      if (data) new ArchDiagram(root, data);
    });
    initMermaidHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
