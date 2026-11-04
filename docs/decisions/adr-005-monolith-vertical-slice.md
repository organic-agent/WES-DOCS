---
title: "ADR-005 — 도메인 수직 슬라이스"
parent: "기술 결정 (ADR)"
nav_order: 5
---

# ADR-005 — 도메인 수직 슬라이스와 모듈 분리

상태 : 채택 · 모듈 소스 분리 2026-10-14

## 결정

도메인별로 정책·서비스·저장소를 묶는다. 공통 구현은 `wes-domain`, 공개 입구와 Flyway는 `wes-api`, 관리자 입구는 `wes-admin-api`가 소유한다. 두 API는 같은 도메인을 사용하면서 실행·인증·네트워크를 분리한다.

## 이유와 결과

공유 루트 소스를 include/exclude로 나누던 구조를 각 모듈의 실제 `src/`로 옮겨 소유권을 디렉터리에 드러냈다. 공용 테스트는 `testFixtures`, 관리자 테스트용 SQL은 공개 API의 리소스 아티팩트로 제공한다. 모델 추론은 별도 AI 저장소에서 배포한다.

근거 : [서버 #309](https://github.com/organic-agent/organic-agent-server/pull/309). [백엔드](../tech/server.md) · [Application](../architecture/application.md)
