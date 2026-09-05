---
title: 기술 구현
nav_order: 6
has_children: true
---

# 기술 구현

제품 API, 사용자 웹, 관리자 운영, AI 실행과 인프라는 책임과 배포 경계를 나눈다.

| 영역 | 구현 | 저장소 |
|:---|:---|:---|
| 공개·관리자 API | Kotlin/JVM 21, Spring Boot, JPA, Flyway, PostgreSQL, Spring Security | `WES-Server` |
| 사용자 웹 | Next.js App Router, React, TypeScript, Tailwind CSS, Vercel | `WES-Web` |
| 관리자 UI | Next.js, 별도 관리자 세션, 내부 관리자 API | `WES-BackOffice` |
| AI 실행 | 분석·분류·추천 워커. 서버가 소유한 작업 계약을 소비 | 외부 AI 워커 저장소 |
| 인프라 | Terraform 10개 모듈, AWS, GitHub Actions OIDC, SSM, Tailscale | `WES-Infra` |

## 관통하는 원칙

- 이미지 바이트는 앱 서버를 지나지 않는다.
- Flyway가 스키마를 소유하고 Hibernate는 `validate`만 한다.
- 카테고리·분류 작업·셀렉 항목은 복합 FK로 같은 갤러리에 묶는다. 그 밖의 논리 참조와 서비스 검증은 ERD에서 구분한다.
- 공개 `/api/v1`과 내부 `/internal/admin/v1`은 인증과 네트워크 경계를 분리한다.
- 모델 런타임은 제품 서버 저장소에 포함하지 않는다.

| 페이지 | 내용 |
|:---|:---|
| [백엔드](server.md) | V1→V6 스키마, 도메인과 공개·관리자 계약 |
| [프론트엔드](web.md) | 복구된 Web main과 서버 계약의 차이 |
| [백오피스](backoffice.md) | 최고 관리자 UI·BFF·비공개 관리자 API |
| [AI 파이프라인](ai-pipeline.md) | 제품 서버와 외부 워커의 경계 |
| [인프라와 배포](infra.md) | 10개 모듈과 비공개 관리자 경로 |
| [PoC](poc.md) | 직접 업로드·파생본 열람의 측정 근거 |
| [데이터 모델](../data-model/index.md) | 전체→세부 ERD와 구현 SHA |
