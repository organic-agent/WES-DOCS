// mermaid 플로우차트 호버 강조
// 노드에 마우스를 올리면 직접 의존 관계인 노드·엣지만 남기고 흐린다.
// mermaid가 비동기 렌더하므로 SVG가 생길 때까지 잠시 대기한 뒤 연결한다.
(function () {
  'use strict';

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaidHover);
  } else {
    initMermaidHover();
  }
})();
