---
title: "Cycle 6 (8/31 - 9/6)"
parent: 스프린트
nav_order: 6
---

# Cycle 6 — 전체 구현 정합화와 계층형 ERD

| | |
|:---|:---|
| 기간 | 2026-08-31 - 09-06 |
| 확인일·상태 | 2026-09-05 — Server·BackOffice 반영, Infra 변경 0 apply 성공, Web 복구 상태 반영 |

## 완료한 일

### Server

- 전역 역할을 작업공간·갤러리 컨텍스트 권한으로 전환했다.
- 다중 STUDIO OWNER와 마지막 OWNER 보호를 구현했다.
- 카테고리·분류 작업·셀렉에 갤러리 복합 FK와 사진별 상태를 추가했다.
- 갤러리 생성 시 셀렉을 함께 만들고 작성자·정렬 메타데이터를 추가했다.
- 로그인 사용자와 게스트를 협업 참여자로 통합했다.
- 고객 보정 요청과 스튜디오 결과 처리 권한을 분리했다.

### Web·BackOffice·Infra

- Web 전환 변경은 이후 명시적으로 철회했다. 당시 main은 `7bd2c65`였고 그 시점의 새 작업공간·카테고리·협업 계약은 미반영이었다. 당시 전환 작업을 현재 완료 기능에 포함하지 않는다.
- BackOffice를 통합 참여자, 분류 사진 상태, 셀렉 메타데이터와 현재 관리자 리소스 계약에 맞췄다.
- Infra의 Tailnet 정책 문구를 `autogroup:member + autogroup:tagged → tag:wes-admin:443`으로 통일했다.

### Docs

- 전체 ERD에서 8개 기능 문서로 내려가는 [데이터 모델 트리](../data-model/index.md)를 추가했다.

## 검증

- Server: Java 21 전체 테스트 537개, Flyway V1→V6, Hibernate validate 통과
- Web: 철회 전 변경의 CI 결과를 현재 소스 검증으로 인용하지 않는다. 복구·재배포 완료는 당시 작업 기록에 남아 있다.
- BackOffice: 테스트 44개, ESLint, TypeScript, Next 프로덕션 빌드 통과

{: .note }
Server `bc8948a`와 BackOffice `16b19e8`의 배포가 성공했고 Infra `cfbd72e` apply는 추가·변경·삭제 모두 0이었다. 당시 배포 기록은 [Server](https://github.com/organic-agent/organic-agent-server/actions/runs/33916690086)·[BackOffice](https://github.com/organic-agent/organic-agent-backoffice/actions/runs/33917787207)에서 확인한다. 현재 기준은 [구현 상태](../implementation-status.md)로 분리한다.

이 페이지는 9월 당시 기록이다. 이후 변경은 [변경 기록](../updates.md)과 [현재 구현 기준](../implementation-status.md)을 따른다.
