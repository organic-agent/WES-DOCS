---
title: 구현 기준과 확인 상태
nav_order: 9
---

# 구현 기준과 확인 상태

2026-09-05 원격 `main`과 소스를 대조한 기준이다. 제품 정책·ERD는 서버 계약을 설명하며, 사용자 Web의 연동 완료를 뜻하지 않는다.

## 저장소별 기준

| 저장소 | 확인한 main | 상태 |
|:---|:---|:---|
| WES-Server | [`bc8948a`](https://github.com/organic-agent/organic-agent-server/tree/bc8948a89d2f2c964753710ab938da3a9af8d15f) | V1-V6, 컨텍스트 권한·공동 셀렉·통합 협업·현재 제품 계약 반영 |
| WES-BackOffice | [`16b19e8`](https://github.com/organic-agent/organic-agent-backoffice/tree/16b19e8c47e5f958517d478d466cb2a471e127ec) | 현재 관리자 API, 참여자·카테고리 상태·셀렉 메타데이터 반영 |
| WES-Web | [`7bd2c65`](https://github.com/organic-agent/organic-agent-web/tree/7bd2c65724433219a062415016e7d710226e6d20) | 이전 상태로 복구됨. 작업공간·카테고리·통합 협업의 새 계약 전환은 미반영 |
| WES-Infra | [`cfbd72e`](https://github.com/organic-agent/organic-agent-infra/tree/cfbd72ebb172b627b7ee6b13a55907f81f1c6837) | 10개 모듈과 Tailnet member/tagged의 관리자 HTTPS 접근 정책 반영 |

---

## 배포 기록과 이번 확인 범위

- Server는 PR [#143](https://github.com/organic-agent/organic-agent-server/pull/143)·[#145](https://github.com/organic-agent/organic-agent-server/pull/145) 병합 후 [배포 33916690086](https://github.com/organic-agent/organic-agent-server/actions/runs/33916690086)에서 V1-V6·공개/관리자 health 검증을 완료했다. 당시 전체 테스트 기록은 537개다.
- BackOffice는 PR [#7](https://github.com/organic-agent/organic-agent-backoffice/pull/7) 병합 후 [배포 33917787207](https://github.com/organic-agent/organic-agent-backoffice/actions/runs/33917787207)에서 버전·health·관리자 세션 `401`·Caddy 경유 검증을 완료했다. 당시 테스트 기록은 44개다.
- Web은 변경 철회 후 `7bd2c65`로 복구·재배포한 기록을 기준으로 한다. 복구 배포 Actions 기록은 이후 삭제돼 현재 Actions만으로 재현할 수 없으며, 재배포 완료는 당시 작업 기록에서 확인한 사실이다. 철회된 구현과 그 CI 결과를 현재 기능으로 인용하지 않는다.
- Infra는 PR [#22](https://github.com/organic-agent/organic-agent-infra/pull/22)와 CI를 완료했다. [실행 33914373424](https://github.com/organic-agent/organic-agent-infra/actions/runs/33914373424)의 apply-app이 성공했고 변경은 추가 0·변경 0·삭제 0이다.
- 실제 Tailnet 정책은 앞선 작업에서 저장했지만 마지막 배포 점검에서는 인증 세션이 없어 관리자 화면의 동일성을 다시 확인하지 못했다.

이번 문서 감사는 원격 커밋·소스·문서 빌드와 공개 Pages를 확인한다. 기존 배포 기록을 오늘의 운영 DB·Tailnet 실측으로 바꾸어 적지 않는다. 외부 AI 워커의 배포 SHA와 모델 성능은 별도 확인 대상이다.

---

## 정책과 현재 구현에 남은 차이

| 항목 | 확정 정책 | 현재 Server V6 소스 |
|:---|:---|:---|
| PERSONAL 권한 | PERSONAL OWNER와 활성 GALLERY_MEMBER가 고객 편집자 | PERSONAL_PARTNER 수락은 workspace MEMBER를 만들고 `requireManager`·`requireSelectionEditor`가 PERSONAL MEMBER까지 허용한다. 업로드·카테고리·셀렉·별점·보정 요청 권한이 정책보다 넓다. 협업 반응은 별도 OWNER/갤러리 멤버 검사이므로 같지 않다. |
| 보정 제출 리비전 | 요청 시점 셀렉 결과에 고정 | 공개 `submitRound`는 `selection_revision_id`를 채우지 않는다. 관리자 셀렉 변경 전 스냅샷·납품 처리에서 nullable 리비전을 연결한다. |
| 납품 기록 | 스튜디오 결과 처리와 납품 흐름 | 공개 API는 결과 업로드·회차 완료와 갤러리 DELIVERY 단계까지 처리한다. 동의·납품 시각·메모는 관리자 운영 경로에서 기록한다. |

이는 소스에서 확인한 차이이며 정책을 확대하거나 구현 완료로 처리하지 않는다. 이번 범위는 문서 최신화이므로 제품 코드는 변경하지 않았다.

근거 : [GalleryInviteService와 GalleryAccessPolicy](https://github.com/organic-agent/organic-agent-server/tree/bc8948a89d2f2c964753710ab938da3a9af8d15f/src/main/kotlin/com/soma/wes/gallery), [RetouchService](https://github.com/organic-agent/organic-agent-server/blob/bc8948a89d2f2c964753710ab938da3a9af8d15f/src/main/kotlin/com/soma/wes/retouch/service/RetouchService.kt), [AdminWorkflowRepository](https://github.com/organic-agent/organic-agent-server/blob/bc8948a89d2f2c964753710ab938da3a9af8d15f/src/main/kotlin/com/soma/wes/admin/resource/repository/AdminWorkflowRepository.kt).

---

## 읽을 때 구분할 것

- [제품](product/index.md)·[데이터 모델](data-model/index.md) : 확정 정책과 현재 서버 구현이다.
- [아키텍처](architecture/index.md) : 현재 사용자 흐름과 실행 경계다.
- [프론트엔드](tech/web.md) : 실제 Web main의 남은 계약 차이다.
- [스프린트](sprints/index.md) : 실제 날짜·집계를 유지하며 현재 유효한 변경을 정리한다. 과금·성과 가설은 [배경](background/index.md)에서 구분한다.
