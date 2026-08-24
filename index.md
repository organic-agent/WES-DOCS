---
title: 홈
layout: home
nav_order: 1
permalink: /
---

# EasySelect
{: .fs-9 }

수천 장의 웨딩 원본 사진에서, 부부가 지치지 않고 최종 사진을 고르게 하는 셀렉 플랫폼.
{: .fs-6 .fw-300 }

[왜 만들었나](docs/background/index.md){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[기술 구현 보기](docs/tech/index.md){: .btn .fs-5 .mb-4 .mb-md-0 .mr-2 }
[easyselect.kr](https://easyselect.kr){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## 무엇을 만드는가

사진작가(스튜디오)가 갤러리를 만들어 촬영 원본을 업로드하면, AI가 사진의 **시각적 유사도와 기술 품질**을 분석해 유사 사진 스택을 구성합니다. 초대받은 예비 부부는 **직접 셀렉 · AI 1차 셀렉 · 게스트 협업 셀렉**을 활용해 최종 사진을 고르고, 결과는 사진작가에게 전달됩니다.

AI는 카테고리를 만들지 않고, 정상 사진을 임의로 버리지 않고, 취향을 학습하지 않습니다. 후보를 줄이고 수정 가능한 초안을 만들 뿐 — **최종 결정은 언제나 사람**이 합니다.

## 핵심 설계 세 가지

**1. 이미지 바이트는 앱 서버를 지나지 않는다.**
서버는 presigned URL만 발급하고 브라우저가 S3에 직접 업로드·다운로드합니다. 임베딩·미리보기 파생본·EXIF 추출은 전부 Lambda가 갤러리 단위 한 번의 호출로 처리합니다. → [ADR-001](docs/decisions/adr-001-presigned-direct-upload.md)

**2. 카테고리가 아니라 유사도.**
"컨셉별 자동 분류"를 기획 단계에서 폐기하고, DINOv2 768차원 임베딩 + pgvector + Union-Find 클러스터링으로 유사 사진 스택을 만듭니다. 사용자는 5틱 슬라이더로 스택 강도를 조절합니다. → [피벗 이야기](docs/background/pivot.md)

**3. 실험이 결정한 설계.**
업로드 방식과 이미지 로딩 전략은 감이 아니라 PoC 2건의 측정 수치로 결정했습니다. 원본 직로드 3.1초를 파생본 전환으로 414ms까지 줄인 실험이 그대로 프로덕션 설계가 되었습니다. → [PoC — 설계를 결정한 두 실험](docs/tech/poc.md)

## 문서 지도

| 섹션 | 내용 |
|:---|:---|
| [배경](docs/background/index.md) | 왜 이 프로젝트를 시작했는지 — 셀렉 피로라는 문제, 그리고 방향 전환의 기록 |
| [제품](docs/product/index.md) | 제품 정의, 역할과 개념, 사용자 흐름, 기능별 정책, 범위 |
| [아키텍처](docs/architecture/index.md) | 4단계 줌 레벨 다이어그램 — 정보 구조부터 AWS 토폴로지까지 |
| [기술 구현](docs/tech/index.md) | 백엔드 · 프론트엔드 · AI 파이프라인 · 인프라 · PoC |
| [기술 결정 (ADR)](docs/decisions/index.md) | 되돌아볼 수 있게 기록한 주요 기술 의사결정 |
| [스프린트](docs/sprints/index.md) | Linear 사이클 단위 개발 기록 |

## 팀과 운영

3인 팀이 만듭니다. 직군은 팀 분리 대신 Linear 라벨(FE / BE / INFRA / AI)로 구분하고, 기능 단위 프로젝트(01. 인증 ~ 12. 백오피스)와 주 단위 사이클로 운영합니다. Cycle 1은 2026년 7월 31일에 시작했습니다. 자세한 운영 방식은 [스프린트](docs/sprints/index.md) 섹션에 있습니다.

## 저장소

| 저장소 | 역할 |
|:---|:---|
| `WES-Server` | Kotlin / Spring Boot 백엔드 (13개 도메인) + Python Lambda embedder |
| `WES-Web` | Next.js 프론트엔드 (작가 · 부부 · 게스트) |
| `WES-Infra` | Terraform AWS 인프라 (7개 모듈 + DNS 스택) |
| `WES-Upload-PoC` | 대용량 업로드 방식 벤치마크 (presigned PUT vs ZIP) |
| `WES-ImageLoad-PoC` | 뷰어 이미지 로딩 전략 실험 (파생본 · 프리페치 · 디바운스) |
| `WES-PM` | 기획서와 아키텍처 다이어그램 원본 (drawio) |
