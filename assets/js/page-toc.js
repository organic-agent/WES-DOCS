// 오른쪽 페이지 내비게이터 ("이 페이지")
// 본문(.main-content)의 h2/h3를 수집해 고정 TOC를 만들고,
// IntersectionObserver로 현재 읽는 섹션을 강조한다.
// 헤딩이 2개 미만이거나 문서 레이아웃이 아닌 페이지(전체 화면 다이어그램 등)에서는 아무 것도 하지 않는다.
(function () {
  'use strict';

  function build() {
    var content = document.querySelector('.main-content');
    if (!content) return;
    var headings = Array.prototype.slice
      .call(content.querySelectorAll('h2[id], h3[id]'))
      .filter(function (h) { return h.textContent.trim(); });
    if (headings.length < 2) return;

    var toc = document.createElement('nav');
    toc.className = 'page-toc';
    toc.setAttribute('aria-label', '이 페이지 목차');
    var title = document.createElement('p');
    title.className = 'page-toc__title';
    title.textContent = '이 페이지';
    toc.appendChild(title);
    var ul = document.createElement('ul');
    toc.appendChild(ul);

    var links = {};
    headings.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'page-toc__item page-toc__item--' + h.tagName.toLowerCase();
      var a = document.createElement('a');
      a.href = '#' + h.id;
      // 앵커 아이콘 등 자식 요소를 제외한 순수 텍스트
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      ul.appendChild(li);
      links[h.id] = a;
    });
    document.body.appendChild(toc);

    // 스크롤스파이 — 화면 상단 1/3 지점을 지난 마지막 헤딩을 활성으로 본다
    var activeId = null;
    function setActive(id) {
      if (id === activeId) return;
      if (activeId && links[activeId]) links[activeId].classList.remove('is-active');
      if (id && links[id]) links[id].classList.add('is-active');
      activeId = id;
    }
    function onScroll() {
      var line = window.innerHeight * 0.3;
      var current = null;
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top <= line) current = headings[i].id;
        else break;
      }
      setActive(current || headings[0].id);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
