---
title: "ADR-005 — 도메인 수직 슬라이스"
parent: 기술 결정 (ADR)
nav_order: 5
---

# ADR-005 — 도메인 수직 슬라이스와 실행 경계

## 결정

제품 코드는 도메인별로 Controller·Service·Repository·Domain을 묶는다. 공개 API와 관리자 API는 이 코드를 공유하지만 실행 프로세스·인증·네트워크 경계를 분리한다.

---

## 근거

도메인별 책임을 같은 패키지에서 확인하고 외부 시스템 어댑터도 해당 도메인 안에 둔다. 모델 실행은 JVM 제품 서버와 의존성·배포 주기가 달라 외부 워커가 담당한다.

---

## 결과

- 제품 API는 `/api/v1`, 관리자 API는 `/internal/admin/v1` 계약을 사용한다.
- 관리자 UI는 BackOffice BFF를 거쳐 비공개 API를 호출한다.
- 서버 `analysis`는 외부 모델 단계를 호출하고 결과를 관측한다.
- 현재 패키지와 흐름은 [백엔드](../tech/server.md), [Application](../architecture/application.md)을 따른다.
