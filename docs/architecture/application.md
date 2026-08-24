---
title: 2. Application — 화면과 기능
parent: 아키텍처
nav_order: 2
---

# Application Architecture — 화면과 기능

Information Architecture를 애플리케이션 책임 구조로 번역한 **기술 중립(technology-neutral) 모듈 아키텍처**입니다. 어떤 프레임워크로 만들지 정하기 전에, 무엇이 무엇을 책임지는지 먼저 그렸습니다.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/application.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/application.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/application.png">JavaScript가 꺼져 있습니다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/application.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/application.png){: .fs-3 }

## 읽는 법 — 5개 세로 레인

**draw.io 원본 렌더링 그대로**입니다 — 모듈 박스 안의 정책 불릿(사실상 기능 명세) 전문까지 원본 그대로 읽을 수 있고, 그 위에 상호작용만 얹었습니다. 마우스를 올리면 옅은 강조, 클릭하면 고정, 드래그 이동 · 휠 줌.

사용자 · 진입점 → Web Experience → Application(**모듈형 단일 앱**의 논리 모듈 9종) → Async · External → Data 순서입니다.

- 컨테이너 안의 불릿 줄에 올려도 **그 컨테이너 단위로 강조**됩니다 — UI 박스에 올리면 그 화면이 부르는 모듈이, 모듈에 올리면 의존하는 화면들과 이어지는 외부 시스템이 드러납니다. `셀렉 · 제출 · AI 초안` 모듈을 클릭해 보면 부부 화면 대부분이 이 모듈 하나로 모이는 것 — 이 제품의 무게중심 — 이 보입니다.
- 비동기 경로(점선)는 요청-응답 밖에서 일어나는 일입니다: `PhotoUploaded`, `AISelectionDraftRequested` 이벤트가 Message Queue → AI Worker로 흐릅니다.
- **`Application Backend` 컨테이너 전체에서 Relational Database로 나가는 엣지 하나**가 이 아키텍처의 배포 결정을 요약합니다 — 논리 모듈은 9개지만 저장소와 배포 단위는 하나입니다.

정책 전문은 [기능별 정책](../product/policies.md)에서, "정책 박스"들의 배경은 [미정과 범위 밖](../product/scope.md)과 함께 볼 수 있습니다.

{: .highlight }
레인 5의 "AI 안전 경계"와 "감성 보호"는 별도 정책 박스로 그려져 있습니다 — 카테고리 생성 금지, 정상 사진 폐기 금지, 취향 학습 금지, 자동 제출 금지. AI 원칙이 아키텍처 다이어그램 수준에서 명문화되어 있는 셈입니다.

범례에서 하나 눈여겨볼 것: **"모듈 경계는 논리적 책임을 나타내며 독립 배포 단위를 의미하지 않음"** — 이 문장이 모놀리스 선택([ADR-005](../decisions/adr-005-monolith-vertical-slice.md))의 출발점입니다.

다음 줌 → [System — 시스템 구성](system.md)
