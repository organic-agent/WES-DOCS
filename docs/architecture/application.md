---
title: 2. Application — 화면과 기능
parent: 아키텍처
nav_order: 2
---

# Application Architecture — 화면과 기능

Information Architecture를 애플리케이션 책임 구조로 번역한 **기술 중립(technology-neutral) 모듈 아키텍처**입니다. 어떤 프레임워크로 만들지 정하기 전에, 무엇이 무엇을 책임지는지 먼저 그렸습니다.

[원본 크기로 보기]({{ site.baseurl }}/assets/img/architecture/application.png){: .btn .btn-outline .fs-3 }

![Application Architecture]({{ site.baseurl }}/assets/img/architecture/application.png){: .arch-diagram }

## 읽는 법 — 5개 세로 레인

| 레인 | 내용 |
|:---|:---|
| 1. 사용자 · 진입점 | 방문자(Public) / 사진작가(Studio) / 부부(Couple) / 게스트(Guest) |
| 2. Web Experience | 역할별 UI 컴포넌트 약 20개 — 작가 측(업로드·갤러리 운영·템플릿·보정 설정), 부부 측(탐색 사이드바·AI 1차 셀렉·협업·앨범 편집), 게스트 측(공유 URL 페이지) |
| 3. Application | **모듈형 단일 앱** 안의 9개 논리 모듈 — 인증·권한 / 스튜디오·작업공간 / 갤러리·사진 / 셀렉·제출·AI 초안 / 폴더 계층 / 협업 공유·반응 / 앨범 구성 / 보정 요청 / 외부 자동 알림 |
| 4. Async · External | OAuth IdP / Object Storage / Image Delivery / Message Queue / AI 사진 처리 Worker / AI 유사도·셀렉 Engine / Deadline·State Evaluator / Notification Provider |
| 5. Data | 관계형 데이터베이스 + 논리 데이터 도메인 + **정책 박스** (갤러리·선택 정책, 초대·공유 정책, 미디어 정책, 폴더 제약, AI 안전 경계, 협업 권한) |

각 모듈 박스 안에 정책 불릿이 촘촘히 적혀 있어 사실상 **기능 명세서** 역할을 합니다. 문서화된 정책 전문은 [기능별 정책](../product/policies.md)에서 볼 수 있습니다.

{: .highlight }
레인 5의 "AI 안전 경계"와 "감성 보호"는 별도 정책 박스로 그려져 있습니다 — 카테고리 생성 금지, 정상 사진 폐기 금지, 취향 학습 금지, 자동 제출 금지. AI 원칙이 아키텍처 다이어그램 수준에서 명문화되어 있는 셈입니다.

범례에서 하나 눈여겨볼 것: **"모듈 경계는 논리적 책임을 나타내며 독립 배포 단위를 의미하지 않음"** — 이 문장이 모놀리스 선택([ADR-005](../decisions/adr-005-monolith-vertical-slice.md))의 출발점입니다.

다음 줌 → [System — 시스템 구성](system.md)
