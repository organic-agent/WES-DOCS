---
title: 2. Application — 화면과 기능
parent: 아키텍처
nav_order: 2
---

# Application Architecture — 화면과 기능

Information Architecture를 애플리케이션 책임 구조로 번역한 **기술 중립(technology-neutral) 모듈 아키텍처**다. 어떤 프레임워크로 만들지 정하기 전에, 무엇이 무엇을 책임지는지부터 그렸다.

{: .warning }
2026-08 역사적 스냅샷이다. 현재 도메인과 API 경계는 [백엔드](../tech/server.md), [프론트엔드](../tech/web.md), [기능별 ERD](../data-model/index.md)를 따른다.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/application.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/application.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/application.png">JavaScript가 꺼져 있다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/application.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/application.png){: .fs-3 }

## 읽는 법 — 5개 세로 레인

**draw.io 원본 렌더링 그대로**다 — 모듈 박스 안의 정책 불릿(사실상 기능 명세) 전문까지 원본대로 읽을 수 있다. 마우스를 올리면 옅은 강조, 클릭하면 고정, 드래그 이동 · 휠 줌.

레인은 사용자 · 진입점 → Web Experience → Application(**모듈형 단일 앱**의 논리 모듈 9종) → Async · External → Data 순서다.

- 컨테이너 안의 불릿 줄에 올려도 **그 컨테이너 단위로 강조된다**. UI 박스에 올리면 그 화면이 부르는 모듈이, 모듈에 올리면 의존하는 화면들과 이어지는 외부 시스템이 드러난다. `셀렉 · 제출 · AI 초안` 모듈을 클릭하면 부부 화면 대부분이 이 모듈 하나로 모인다.
- 비동기 경로(점선)는 요청-응답 밖에서 일어나는 일이다 : `PhotoUploaded`, `AISelectionDraftRequested` 이벤트가 Message Queue → AI Worker로 흐른다.
- `Application Backend` 컨테이너 전체에서 Relational Database로 나가는 엣지 하나가 배포 결정을 요약한다.

⇒ 논리 모듈은 9개지만 저장소와 배포 단위는 하나다.

정책 전문은 [기능별 정책](../product/policies.md)에서, "정책 박스"들의 배경은 [미정과 범위 밖](../product/scope.md)과 함께 볼 수 있다.
