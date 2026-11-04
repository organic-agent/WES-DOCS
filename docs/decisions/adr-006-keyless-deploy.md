---
title: "ADR-006 — 키 없는 배포"
parent: "기술 결정 (ADR)"
nav_order: 6
---

# ADR-006 — 키 없는 배포와 순차 교체

상태 : 채택 · 롤링 배포 반영 2026-10

## 결정

GitHub Actions는 OIDC로 AWS 역할을 얻고 SSM으로 배포한다. 공개 API는 EC2 ASG의 서버를 한 대씩 ALB 대상에서 빼고 교체한다. 릴리스 묶음을 보존해 실패한 서버를 직전 버전으로 돌린다. AI와 관리자 앱은 각각 별도 배포 경로를 사용한다.

## 이유와 결과

장기 AWS 키·SSH 키를 저장하지 않으며, 한 대를 교체하는 동안 나머지 서버가 요청을 받는다. 다중 서버의 주기 작업은 PostgreSQL 임대로 한 대만 실행한다. 관리 포트의 liveness로 과부하 시 헬스체크가 사용자 요청 뒤에 서는 일을 줄인다.

근거 : [서버 #328](https://github.com/organic-agent/organic-agent-server/pull/328), [인프라 #125](https://github.com/organic-agent/organic-agent-infra/pull/125), [리더 #344](https://github.com/organic-agent/organic-agent-server/pull/344). [배포 상세](../tech/infra.md)
