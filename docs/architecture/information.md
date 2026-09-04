---
title: 1. Information — 사용자 여정
parent: 아키텍처
nav_order: 1
---

# Information Architecture — 사용자 여정

역할별 화면·정보 구조와 사용자 여정이다. 4단계 줌의 첫 번째 — 가장 UX에 가까운 다이어그램이다.

{: .warning }
2026-08 역사적 스냅샷이다. 전역 역할·유사도 스택·앨범 흐름은 현재 계약이 아니다. 현행 여정은 [사용자 흐름](../product/flows.md)과 [데이터 모델](../data-model/index.md)을 따른다.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/information.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/information.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/information.png">JavaScript가 꺼져 있다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/information.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/information.png){: .fs-3 }

## 읽는 법

**draw.io 원본 렌더링 그대로**다 — 화면 80개와 흐름 85개가 원본 배치 그대로 있고, 그 위에 상호작용만 얹었다. 요소에 마우스를 올리면 직접 이어지는 앞뒤 단계만 남고(옅은 강조), 클릭하면 고정된다(강한 강조). 드래그로 이동하고 휠로 확대한다.

- 공개 영역 : 랜딩 → OAuth 로그인 → 역할 분기. 어디서 가입했는지(랜딩 vs 초대 링크)가 역할을 정한다. `역할 분기`를 클릭하면 세 갈래가 고정된 채 보인다.
- 사진작가 여정 : 스튜디오 만들기 → 갤러리 목록/생성 → 갤러리 페이지(업로드·초대·대시보드) → 최종 결과·목업 확인. 앨범 템플릿 편집 갈래가 따로 있다.
- 업로드 상태 체인 : `사진 업로드`에 올리면 처리 중 → 성공/실패(재시도) → AI 유사도 분석으로 넘어가는 시스템 체인이 드러난다.
- 부부 여정 : 사진 탐색 → 유사 사진 스택(5틱 슬라이더) → 폴더 고정 → 직접/AI 셀렉 → 앨범 목업 → 최종 제출. `선택 앨범`에 올리면 셀렉의 모든 갈래가 이 화면에서 시작하는 것이 보인다.
- 게스트 여정 : 진입점이 로그인이 아니라 부부의 `링크 발급`이다.

아래 설명은 그림을 읽기 위한 당시 용어다. 현재 정책은 [사용자 흐름](../product/flows.md)을 기준으로 한다.
