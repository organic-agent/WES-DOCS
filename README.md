# WES-DOCS

WES(Wedding Easy Select) 프로젝트 문서 사이트.

**사이트: <https://organic-agent.github.io/WES-DOCS/>**

## 어떻게 동작하나

- GitHub Pages **네이티브 Jekyll 빌드**를 사용한다. 로컬 빌드 도구 없이 `main`에 push하면 자동으로 빌드·배포된다.
- 테마는 [just-the-docs](https://just-the-docs.com)를 `remote_theme`으로 사용한다 (`_config.yml`에 태그 핀).
- 빌드 성공 여부는 repo **Actions 탭의 "pages build and deployment"** 워크플로에서 확인한다. 빌드가 깨져도 로컬에서는 아무 신호가 없다.

## 문서 추가하는 법

1. `docs/<섹션>/` 아래에 `.md` 파일을 만든다.
2. front matter에 `title`, `parent`(섹션 index의 title과 **정확히 일치**), `nav_order`를 적는다.

```yaml
---
title: Cycle 6 (8/31–9/6)
parent: 스프린트
nav_order: 6
---
```

3. commit & push. 끝. 사이드바 내비게이션에 자동으로 나타난다.

## 집필 규칙

- **Liquid 충돌 주의**: 본문·코드 블록에 `{{ }}` 또는 `{% %}`가 들어가면 Jekyll이 템플릿으로 해석해 빌드가 깨지거나 내용이 사라진다. 해당 구간을 `{% raw %} … {% endraw %}`로 감싼다.
- **이미지 경로**: 반드시 `{{ site.baseurl }}/assets/img/...` 패턴을 쓴다 (프로젝트 페이지라 baseurl이 붙는다).
- **페이지 간 링크**: 상대 `.md` 경로로 쓴다 (`[제품](../product/index.md)`) — jekyll-relative-links가 URL로 변환한다.
- **대형 Mermaid 금지**: mermaid 기본 maxTextSize를 넘는 다이어그램(수백 클래스)은 렌더에 실패한다. 발췌해서 싣고 전체는 원본 저장소로 링크한다.
- **`.nojekyll` 파일 생성 금지**: 빌드 자체가 꺼진다.
- **공개 저장소**: 운영 실값(시크릿 경로, DB 계정, 버킷명 등)은 적지 않는다. "무엇을 왜"만 기록한다.

## 인터랙티브 다이어그램 — 두 가지 방식

**① drawio 원본 임베드 방식** (Information · Application) — draw.io가 렌더한 SVG를 그대로 임베드하고 호버/클릭 강조 + 팬/줌만 얹는다. 원본 모습이 100% 유지된다.

drawio 원본을 수정했다면 두 명령으로 재생성한다:

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format svg \
  --embed-svg-fonts false --theme light --border 8 \
  --output assets/diagrams/interactive/<이름>.svg <원본>.drawio
python3 scripts/drawio-map.py <원본>.drawio assets/diagrams/interactive/<이름>.map.json
```

- 뷰어: `assets/js/drawio-view.js` (`.drawio-arch[data-svg][data-map]`를 자동 초기화)
- 맵 스크립트가 호버 단위를 계산한다 — 컨테이너 안 불릿은 컨테이너로 상속, 보이지 않는 경유점은 병합, 제목·범례는 장식 취급
- 전체 화면 페이지: `diagrams/<이름>.html`

**② 데이터 기반 HTML 방식** (System · Infrastructure) — 레인/노드/엣지를 `assets/js/arch-data.js`에 선언하면 `assets/js/arch-diagram.js`가 그린다. 원본과 다른 재구성(예: "예정" 배지, 브랜드 스타일)이 필요할 때 쓴다. 페이지에는 `<div class="wes-arch" data-arch="<이름>"></div>` 한 줄.

mermaid 플로우차트에도 같은 호버 강조가 자동 적용된다 (`code.language-mermaid` 감지).

## 다이어그램 원본

아키텍처 다이어그램 원본(.drawio)은 `WES-PM`과 `WES-Infra` 저장소에 있다. 수정 후 재내보내기:

```bash
/Applications/draw.io.app/Contents/MacOS/draw.io --export --format png --scale 2 --border 16 \
  --output assets/img/architecture/<이름>.png <원본>.drawio
```
