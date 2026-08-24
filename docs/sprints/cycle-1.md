---
title: "Cycle 1 (7/31 ~ 8/2)"
parent: 스프린트
nav_order: 1
---

# Cycle 1 — OAuth 인증 백엔드와 기반

| | |
|:---|:---|
| 기간 | 2026-07-31 (금) ~ 08-02 (일) — 주 단위 정착 전의 짧은 첫 사이클 |
| 완료 / 스코프 | 22 / 48 (46%) |
| 라벨 분포 (완료분) | BE 11 · INFRA 7 · FE 4 |

## 목표

서비스의 관문인 **01. 인증(OAuth2 로그인/회원가입)** 백엔드를 완성하고, 그 전 주에 만들어 둔 인프라 기반 위에 올린다.

## 완료한 일

### BE — 인증 완성
- 구글 · 네이버 · 카카오 OAuth2 Client 연동 (WES-85 ~ 87, WES-11)
- 회원·소셜 계정 도메인 모델과 유니크 제약, 최초 OAuth 로그인 자동 가입 (WES-88, 89, 12)
- Access/Refresh JWT 발급·검증, 인증 필터, Refresh 재발급 API (WES-90 ~ 92, 13)

### INFRA — 기반 (사이클 직전 주 완료분 귀속)
- Terraform: EC2 런타임·IAM 인스턴스 프로파일, RDS PostgreSQL 모듈 (WES-110, 111)
- Parameter Store 시크릿 저장소와 OAuth 시크릿 이관 (WES-113, 94, 15)
- CI/CD — 백엔드 빌드·배포 파이프라인, GHCR + SSM Run Command (WES-114) → [ADR-006](../decisions/adr-006-keyless-deploy.md)
- [Upload PoC] LocalStack S3 업로드 벤치마크 — 개별 PUT vs ZIP (WES-164)

### FE — 랜딩
- 랜딩 페이지 디자인 → 레이아웃 → 시안 → 리뷰·확정 (WES-170 ~ 173)

## 이월과 취소

- 스코프 48건 중 26건이 다음 사이클로 이월 — 첫 사이클에 기능 프로젝트의 이슈를 넓게 담아 두고 소화한 만큼 넘긴 구조입니다.
- 인가 컨텍스트·갤러리별 role 인가(WES-14, 93)는 갤러리 도메인이 생기기 전이라 **취소** 후 재정의하기로 했습니다.

## 하이라이트

- **키 없는 배포 파이프라인이 첫 사이클부터 동작** — 액세스 키 없이 OIDC + SSM Run Command로 main 머지 → EC2 배포까지 연결되었습니다.
- Upload PoC의 결론(개별 presigned PUT 채택)이 이후 업로드 설계의 근거가 되었습니다 → [PoC 문서](../tech/poc.md)
