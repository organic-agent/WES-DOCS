---
title: "백오피스"
parent: "기술 구현"
nav_order: 5
---

# 백오피스

최고 관리자가 계정·갤러리·처리 실패·Pro 쿠폰을 운영하는 내부 웹이다. Tailnet과 별도 관리자 세션을 거친다.

## 현재 main

Next.js BFF가 브라우저의 동일 출처 요청을 비공개 관리자 API로 전달한다. 사용자 JWT와 관리자 세션은 분리하며 공개 ALB에 관리자 API를 노출하지 않는다.

| 기능 | 현재 제공 |
|:---|:---|
| 제품 데이터 | 사용자·작업공간·갤러리·사진·폴더·셀렉·협업·보정 조회·운영 |
| 파일·분석 | 사진 교체·처리 실패 확인·재처리·휴지통 |
| Pro 쿠폰 | 1회용·공유 정책, 지정 코드, KST 사용 마감, 계정별 사용 이력·횟수 |
| 안전한 쓰기 | 예상 버전·멱등 키, 사유·감사·변경 스냅샷(현재 main) |

BackOffice main은 10월 26일 쿠폰 관리 변경까지 확인했다. [서버 쿠폰 #327](https://github.com/organic-agent/organic-agent-server/pull/327)과 함께 사용하며, 쿠폰 등록일·사용 마감·갤러리 이용 만료를 구분한다.

---

## develop에만 반영된 관리자 단순화

11월 2일 서버 #354-#360과 BackOffice #24-#29가 develop에 반영됐다. 현재 main의 보장을 이 변경으로 덮어쓰지 않는다.

- 변경 스냅샷 복원·영구 감사·작업 사유·운영 데이터 마스킹을 제거한다.
- V47은 구 감사 저장소, V48은 미사용 외부 알림 outbox를 제거한다.
- V49는 관리자 출처 셀렉 이력과 보정 회차의 이력 참조를 제거한다. AI 초안과 현재 셀렉은 유지한다.
- 관리자 인증·Tailnet 경계·멱등 처리·예상 버전·처리 작업은 유지한다.

근거 : [감사 제거 #355](https://github.com/organic-agent/organic-agent-server/pull/355), [스키마 정리 #358](https://github.com/organic-agent/organic-agent-server/pull/358), [셀렉 이력 #360](https://github.com/organic-agent/organic-agent-server/pull/360).

[확인한 브랜치·SHA](../implementation-status.md) · [관리자 데이터](../data-model/admin-auth-audit.md) · [네트워크 경계](../decisions/adr-011-private-admin-network.md)
