---
title: "Cycle 6 (8/31 - 9/6)"
parent: 스프린트
nav_order: 6
---

# Cycle 6 — 전체 구현 정합화와 계층형 ERD

| | |
|:---|:---|
| 기간 | 2026-08-31 - 09-06 |
| 상태 | 로컬 구현·검증 완료, 원격 PR·운영 배포 미확인 |

## 완료한 일

### Server

- 전역 역할을 작업공간·갤러리 컨텍스트 권한으로 전환했다.
- 다중 STUDIO OWNER와 마지막 OWNER 보호를 구현했다.
- 카테고리·분류 작업·셀렉에 갤러리 복합 FK와 사진별 상태를 추가했다.
- 갤러리 생성 시 셀렉을 함께 만들고 작성자·정렬 메타데이터를 추가했다.
- 로그인 사용자와 게스트를 협업 참여자로 통합했다.
- 고객 보정 요청과 스튜디오 결과 처리 권한을 분리했다.
- 앨범 테이블·API·관리자 계약을 제거하고 `ALBUM` 단계를 `DELIVERY`로 바꿨다.

### Web·BackOffice·Infra

- Web을 작업공간·카테고리·실제 셀렉·협업·보정 API로 전환하고 mock·클러스터·앨범 UI를 제거했다.
- BackOffice를 통합 참여자, 분류 사진 상태, 셀렉 메타데이터와 현재 관리자 리소스 계약에 맞췄다.
- Infra의 Tailnet 정책 문구를 `autogroup:member + autogroup:tagged → tag:wes-admin:443`으로 통일했다.

### Docs

- 전체 ERD에서 9개 기능 문서로 내려가는 [데이터 모델 트리](../data-model/index.md)를 추가했다.
- ADR-003·004를 대체 상태로 보존하고 ADR-008~012를 추가했다.
- 2026-08 draw.io는 역사적 스냅샷으로 표시했다.

## 검증

- Server: Java 21 전체 테스트 537개, Flyway V1→V6, Hibernate validate 통과
- Web: ESLint, TypeScript, Next 프로덕션 빌드 통과
- BackOffice: 테스트 44개, ESLint, TypeScript, Next 프로덕션 빌드 통과
- Infra: Terraform·Tailscale 정책·draw.io 정적 검증 통과

{: .note }
이 상태는 로컬 브랜치의 검증 결과다. PR 병합과 실제 운영 health·배포 SHA는 확인된 뒤 별도로 갱신한다.
