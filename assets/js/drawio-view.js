// drawio SVG 인터랙티브 뷰어
// - draw.io가 내보낸 SVG(data-cell-id 보존)를 원본 그대로 임베드하고,
//   scripts/drawio-map.py가 만든 맵으로 호버/클릭 시 연관 셀만 강조한다.
// - 마우스 올림 = 옅은 강조(peek), 클릭 = 고정 강조(focus), Esc/빈 곳 클릭 = 해제.
// - 드래그 팬 + 휠 줌 + HUD(확대/축소/맞춤).
// 사용: <div class="drawio-arch" data-svg="...svg" data-map="...map.json" [data-full="1"]></div>
(function () {
  'use strict';

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function DrawioView(root) {
    this.root = root;
    this.scale = 1;
    this.tx = 0;
    this.ty = 0;
    this.peekId = null;
    this.pinId = null;
    this.userZoomed = false;
    var self = this;
    var bust = root.getAttribute('data-svg');
    Promise.all([
      fetch(root.getAttribute('data-svg')).then(function (r) { if (!r.ok) throw new Error('svg ' + r.status); return r.text(); }),
      fetch(root.getAttribute('data-map')).then(function (r) { if (!r.ok) throw new Error('map ' + r.status); return r.json(); })
    ]).then(function (res) {
      self.build(res[0], res[1]);
    }).catch(function (err) {
      root.classList.add('drawio-arch--error');
      var p = el('p', 'drawio-arch__hint', root);
      p.textContent = '다이어그램을 불러오지 못했습니다 (' + err.message + '). 아래 정적 PNG 링크를 이용해 주세요.';
    });
  }

  DrawioView.prototype.build = function (svgText, map) {
    var self = this;
    var root = this.root;
    var full = root.getAttribute('data-full') === '1';
    if (full) root.classList.add('drawio-arch--full');

    var noscript = root.querySelector('noscript');
    root.innerHTML = '';
    if (noscript) root.appendChild(noscript);

    el('p', 'drawio-arch__hint', root).textContent =
      '요소에 마우스를 올리면 연관된 것만 강조 · 클릭하면 고정 · 드래그 이동 · 휠 줌 · Esc 해제';

    this.viewport = el('div', 'drawio-arch__viewport', root);
    this.stage = el('div', 'drawio-arch__stage', this.viewport);
    this.stage.innerHTML = svgText;
    this.svg = this.stage.querySelector('svg');
    if (!this.svg) return;
    this.natW = parseFloat(this.svg.getAttribute('width')) || 1000;
    this.natH = parseFloat(this.svg.getAttribute('height')) || 1000;

    // HUD
    var hud = el('div', 'drawio-arch__hud', this.viewport);
    var bIn = el('button', '', hud); bIn.type = 'button'; bIn.textContent = '+'; bIn.setAttribute('aria-label', '확대');
    var bOut = el('button', '', hud); bOut.type = 'button'; bOut.textContent = '−'; bOut.setAttribute('aria-label', '축소');
    var bFit = el('button', '', hud); bFit.type = 'button'; bFit.textContent = '⤢'; bFit.setAttribute('aria-label', '화면 맞춤');

    // ---- 맵 인덱스 ----
    this.edgeById = {};
    this.adj = {};       // nodeId -> {nodeId: true}
    this.incident = {};  // nodeId -> {edgeId: true}
    (map.edges || []).forEach(function (e) {
      self.edgeById[e.id] = e;
      (self.adj[e.s] = self.adj[e.s] || {})[e.t] = true;
      (self.adj[e.t] = self.adj[e.t] || {})[e.s] = true;
      (self.incident[e.s] = self.incident[e.s] || {})[e.id] = true;
      (self.incident[e.t] = self.incident[e.t] || {})[e.id] = true;
    });

    // 각 셀 그룹의 호버 단위(unit) 캐시. 단위가 없으면 장식(dv-static) — 흐리지도, 반응하지도 않는다.
    this.groups = [];
    var groupEls = this.svg.querySelectorAll('[data-cell-id]');
    groupEls.forEach(function (g) {
      var cid = g.getAttribute('data-cell-id');
      var unit = self.edgeById[cid] ? cid : (map.resolve[cid] || null);
      if (!unit) {
        g.classList.add('dv-static');
      }
      self.groups.push({ el: g, unit: unit });
    });

    this.wire(bIn, bOut, bFit);
    this.fit();
    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (!self.userZoomed) self.fit(); })
        .observe(this.viewport);
    }
  };

  // ---- 변환 ----
  DrawioView.prototype.applyTransform = function () {
    this.stage.style.transform = 'translate(' + this.tx + 'px,' + this.ty + 'px) scale(' + this.scale + ')';
  };

  DrawioView.prototype.fit = function () {
    var vw = this.viewport.clientWidth, vh = this.viewport.clientHeight;
    if (!vw || !vh) return;
    var pad = 16;
    this.scale = Math.min((vw - pad * 2) / this.natW, (vh - pad * 2) / this.natH);
    this.scale = Math.max(Math.min(this.scale, 2), 0.05);
    this.tx = (vw - this.natW * this.scale) / 2;
    this.ty = (vh - this.natH * this.scale) / 2;
    this.applyTransform();
  };

  DrawioView.prototype.zoomAt = function (factor, cx, cy) {
    var ns = Math.max(0.05, Math.min(4, this.scale * factor));
    factor = ns / this.scale;
    this.tx = cx - (cx - this.tx) * factor;
    this.ty = cy - (cy - this.ty) * factor;
    this.scale = ns;
    this.userZoomed = true;
    this.applyTransform();
  };

  // ---- 강조 ----
  DrawioView.prototype.relatedOf = function (unit) {
    var rel = {};
    rel[unit] = true;
    var e = this.edgeById[unit];
    if (e) {
      rel[e.s] = true;
      rel[e.t] = true;
    } else {
      Object.keys(this.adj[unit] || {}).forEach(function (n) { rel[n] = true; });
      Object.keys(this.incident[unit] || {}).forEach(function (eid) { rel[eid] = true; });
    }
    return rel;
  };

  DrawioView.prototype.apply = function () {
    var target = this.pinId || this.peekId;
    this.root.classList.toggle('is-focus', !!this.pinId);
    this.root.classList.toggle('is-peek', !this.pinId && !!this.peekId);
    if (!target) {
      this.groups.forEach(function (g) { g.el.classList.remove('dv-on', 'dv-sel'); });
      return;
    }
    var rel = this.relatedOf(target);
    this.groups.forEach(function (g) {
      var on = g.unit && rel[g.unit];
      g.el.classList.toggle('dv-on', !!on);
      g.el.classList.toggle('dv-sel', g.unit === target);
    });
  };

  DrawioView.prototype.unitFromEvent = function (ev) {
    var t = ev.target;
    if (!(t instanceof Element)) return null;
    var g = t.closest('[data-cell-id]');
    if (!g || g.classList.contains('dv-static')) return null;
    var cid = g.getAttribute('data-cell-id');
    for (var i = 0; i < this.groups.length; i++) {
      if (this.groups[i].el === g) return this.groups[i].unit;
    }
    return this.edgeById[cid] ? cid : null;
  };

  // ---- 입력 ----
  DrawioView.prototype.wire = function (bIn, bOut, bFit) {
    var self = this;
    var vp = this.viewport;

    vp.addEventListener('mousemove', function (ev) {
      if (self.panning) return;
      var unit = self.unitFromEvent(ev);
      if (unit !== self.peekId) {
        self.peekId = unit;
        self.apply();
      }
    });
    vp.addEventListener('mouseleave', function () {
      if (self.peekId) { self.peekId = null; self.apply(); }
    });

    // 드래그 팬 + (이동 거의 없을 때) 클릭 판정
    var down = null;
    vp.addEventListener('pointerdown', function (ev) {
      if (ev.button !== 0) return;
      down = { x: ev.clientX, y: ev.clientY, tx: self.tx, ty: self.ty, moved: false };
      vp.setPointerCapture(ev.pointerId);
    });
    vp.addEventListener('pointermove', function (ev) {
      if (!down) return;
      var dx = ev.clientX - down.x, dy = ev.clientY - down.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) {
        down.moved = true;
        self.panning = true;
        vp.classList.add('is-panning');
        self.tx = down.tx + dx;
        self.ty = down.ty + dy;
        self.applyTransform();
      }
    });
    vp.addEventListener('pointerup', function (ev) {
      if (!down) return;
      var wasDrag = down.moved;
      down = null;
      self.panning = false;
      vp.classList.remove('is-panning');
      if (wasDrag) return;
      var unit = self.unitFromEvent(ev);
      self.pinId = (unit && unit !== self.pinId) ? unit : null;
      self.apply();
    });
    vp.addEventListener('pointercancel', function () {
      down = null;
      self.panning = false;
      vp.classList.remove('is-panning');
    });

    vp.addEventListener('wheel', function (ev) {
      ev.preventDefault();
      var r = vp.getBoundingClientRect();
      self.zoomAt(Math.pow(1.0015, -ev.deltaY), ev.clientX - r.left, ev.clientY - r.top);
    }, { passive: false });

    bIn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      self.zoomAt(1.35, vp.clientWidth / 2, vp.clientHeight / 2);
    });
    bOut.addEventListener('click', function (ev) {
      ev.stopPropagation();
      self.zoomAt(1 / 1.35, vp.clientWidth / 2, vp.clientHeight / 2);
    });
    bFit.addEventListener('click', function (ev) {
      ev.stopPropagation();
      self.userZoomed = false;
      self.fit();
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && (self.pinId || self.peekId)) {
        self.pinId = null;
        self.peekId = null;
        self.apply();
      }
    });
  };

  function boot() {
    document.querySelectorAll('.drawio-arch[data-svg][data-map]').forEach(function (root) {
      new DrawioView(root);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
