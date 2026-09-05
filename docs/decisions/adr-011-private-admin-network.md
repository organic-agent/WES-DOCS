---
title: "ADR-011 — 관리자 전용 네트워크"
parent: 기술 결정 (ADR)
nav_order: 11
---

# ADR-011 — 관리자 전용 네트워크

| | |
|:---|:---|
| 상태 | 채택 |
| 시기 | 2026-09 |

## 맥락

BackOffice는 사용자·갤러리·사진·감사·휴지통을 운영하므로 일반 웹과 같은 공개 진입점에 둘 수 없다. 애플리케이션 인증만으로 접근 경계를 설명하기에도 부족하다.

## 결정

Tailnet 443으로 관리자 UI와 동일 출처 BFF를 제공한다. 브라우저는 `/api/admin/*`를 호출하고 BFF가 비공개 Docker 네트워크의 `/internal/admin/v1`로 요청한다. 관리자 API 자체는 Tailnet에 직접 공개하지 않는다. `autogroup:member`와 `autogroup:tagged`가 `tag:wes-admin:443`에 접근할 수 있고, 22·8080·8443 직접 접근은 막는다. Funnel을 사용하지 않으며 관리자 보안 그룹의 공개 ingress는 0이다.

## 결과

- 공개 API와 관리자 API의 네트워크·세션·감사를 분리한다.
- BackOffice는 비로그인 관리자 세션에 `401`을 받아야 한다.
- 저장소의 정책 예시와 실제 Tailnet 정책은 동일해야 한다.
- [관리자 인증·감사 ERD](../data-model/admin-auth-audit.md)가 애플리케이션 경계를 설명한다.
