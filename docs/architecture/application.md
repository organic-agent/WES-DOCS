---
title: 2. Application — 화면과 기능
parent: 아키텍처
nav_order: 2
---

# Application Architecture — 화면과 기능

Information Architecture를 애플리케이션 책임 구조로 번역한 **기술 중립(technology-neutral) 모듈 아키텍처**입니다. 어떤 프레임워크로 만들지 정하기 전에, 무엇이 무엇을 책임지는지 먼저 그렸습니다.

<div class="wes-arch" data-arch="application" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/application.png">JavaScript가 꺼져 있습니다 — 정적 PNG로 보기</a></noscript>
</div>

## 읽는 법 — 5개 세로 레인

사용자 · 진입점 → Web Experience(역할별 UI 4개 묶음) → Application(**모듈형 단일 앱**의 논리 모듈 9종) → Async · External(큐 · 워커 · 엔진) → Data 순서입니다.

- **UI 노드에 마우스를 올리면 그 화면이 어느 모듈을 부르는지**, **모듈에 올리면 어떤 화면들이 그 모듈에 의존하고 어떤 외부 시스템으로 이어지는지** 드러납니다. `셀렉 · 제출 · AI 초안` 모듈에 올려 보면 부부 화면 대부분이 이 모듈 하나로 모이는 것 — 이 제품의 무게중심 — 이 보입니다.
- 비동기 경로(파선)는 요청-응답 밖에서 일어나는 일입니다: `PhotoUploaded`, `AISelectionDraftRequested` 이벤트가 Message Queue → AI Worker로 흐릅니다.
- **모놀리스 그룹 전체에서 Relational Database로 나가는 엣지 하나**가 이 아키텍처의 배포 결정을 요약합니다 — 논리 모듈은 9개지만 저장소와 배포 단위는 하나입니다.

원본 drawio의 모듈 박스 안 정책 불릿(사실상 기능 명세)은 노드 설명으로 압축했습니다. 정책 전문은 [기능별 정책](../product/policies.md)에, "정책 박스 6종"의 상세는 [미정과 범위 밖](../product/scope.md)과 함께 볼 수 있습니다. 원본은 [정적 PNG]({{ site.baseurl }}/assets/img/architecture/application.png)에 있습니다.

{: .highlight }
레인 5의 "AI 안전 경계"와 "감성 보호"는 별도 정책 박스로 그려져 있습니다 — 카테고리 생성 금지, 정상 사진 폐기 금지, 취향 학습 금지, 자동 제출 금지. AI 원칙이 아키텍처 다이어그램 수준에서 명문화되어 있는 셈입니다.

범례에서 하나 눈여겨볼 것: **"모듈 경계는 논리적 책임을 나타내며 독립 배포 단위를 의미하지 않음"** — 이 문장이 모놀리스 선택([ADR-005](../decisions/adr-005-monolith-vertical-slice.md))의 출발점입니다.

다음 줌 → [System — 시스템 구성](system.md)
