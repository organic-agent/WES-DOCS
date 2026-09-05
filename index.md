---
title: 홈
layout: home
nav_order: 1
permalink: /
---

# EasySelect
{: .fs-9 }

사진 업로드부터 카테고리, 셀렉, 협업, 보정과 납품까지 한 갤러리에서 운영하는 웨딩 사진 워크플로다.
{: .fs-6 .fw-300 }

[제품 보기](docs/product/index.md){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[데이터 모델 보기](docs/data-model/index.md){: .btn .fs-5 .mb-4 .mb-md-0 .mr-2 }
[easyselect.kr](https://easyselect.kr){: .btn .fs-5 .mb-4 .mb-md-0 }

---

{: .note }
2026-09-05 기준 Server V6·BackOffice는 반영됐고 Web은 `7bd2c65`로 복구돼 새 계약 연동이 남아 있다. 제품 설명과 실제 화면 상태는 [구현 기준과 확인 상태](docs/implementation-status.md)에서 구분한다.

## 현재 제품 모델

사용자는 작업공간·갤러리 관계에 따라 권한을 가진다. PERSONAL 작업공간을 소유하고 여러 STUDIO 작업공간에 참여하며, 실제 권한은 작업공간과 갤러리 관계에서 계산한다. 갤러리는 작업공간이 소유한다.

사진은 `컨셉 → 세부 → 사진 배정` 카테고리로 정리한다. AI 결과는 사람이 바꿀 수 있는 초안이며 모델 실행은 외부 AI 워커가 담당한다. 셀렉은 갤러리 생성 시 함께 만들고, 로그인 사용자와 비로그인 게스트는 하나의 협업 참여자 모델로 댓글과 좋아요를 남긴다. 고객이 보정 요청을 제출하면 스튜디오가 결과를 처리하고 납품한다.


---

## 구현 원칙

**이미지 바이트는 앱 서버를 지나지 않는다.** 서버는 presigned URL과 객체 메타데이터를 관리하고 브라우저가 S3에 직접 업로드·다운로드한다. → [ADR-001](docs/decisions/adr-001-presigned-direct-upload.md)

**데이터베이스가 갤러리 경계를 지킨다.** 카테고리·분류 작업·셀렉은 `gallery_id` 복합 FK로 다른 갤러리의 행을 연결하지 못한다. → [전체 ERD](docs/data-model/index.md)

**관리자 경계는 공개 서비스와 분리한다.** Tailnet 443의 BackOffice에 접속하고 동일 출처 BFF를 통해 비공개 `/internal/admin/v1`을 호출한다. 관리자 변경은 감사·멱등·리비전으로 추적한다. → [ADR-011](docs/decisions/adr-011-private-admin-network.md)

---

## 문서 지도

| 섹션 | 내용 |
|:---|:---|
| [배경](docs/background/index.md) | 문제 정의·AI 원칙·업무 분담 |
| [제품](docs/product/index.md) | 현재 역할, 사용자 흐름, 정책과 범위 |
| [데이터 모델](docs/data-model/index.md) | 전체 ERD에서 기능별 ERD로 내려가는 구현 기준 |
| [아키텍처](docs/architecture/index.md) | 현재 사용자 흐름과 실행·배포 경계 |
| [기술 구현](docs/tech/index.md) | Server, Web, 외부 AI 경계, BackOffice와 Infra |
| [기술 결정](docs/decisions/index.md) | 현재 적용하는 기술 결정과 근거 |
| [스프린트](docs/sprints/index.md) | Cycle 단위 개발 기록과 현행 정합화 |

## 저장소

| 저장소 | 책임 |
|:---|:---|
| `WES-Server` | Kotlin/Spring 공개 API와 관리자 API, Flyway 데이터 모델 |
| `WES-Web` | Next.js 사용자 웹. 현재 서버 계약과 일부 차이 존재 |
| `WES-BackOffice` | 최고 관리자 운영 UI |
| 외부 AI 워커 | 분석·분류·추천 모델 실행. 제품 저장소와 독립 배포 |
| `WES-Infra` | 10개 Terraform 모듈과 Tailnet 관리자 접근 정책 |
| `WES-DOCS` | 운영 계약과 계층형 ERD |

{: .note }
원격 main과 배포 기록은 [구현 기준과 확인 상태](docs/implementation-status.md)에 기록한다.
