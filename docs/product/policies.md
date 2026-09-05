---
title: 기능별 정책
parent: 제품
nav_order: 3
---

# 기능별 정책

{: .note }
2026-09-05 확정 정책과 Server V6 기준이다. 현재 Web에는 이전 계약·로컬 상태가 남아 있으므로 화면 연동 완료 여부는 [구현 기준과 확인 상태](../implementation-status.md)와 [프론트엔드](../tech/web.md)를 따로 확인한다.

정책은 애플리케이션 권한과 데이터베이스 제약을 함께 만족해야 한다.

## 작업공간과 소유권

- 사용자는 PERSONAL 작업공간 하나를 소유하고 여러 STUDIO에 참여할 수 있다.
- STUDIO는 여러 OWNER를 허용한다. 마지막 OWNER의 강등·탈퇴·회원 탈퇴·관리자 삭제는 `409`다.
- 회원 탈퇴는 PERSONAL과 소유 갤러리를 삭제 대상으로 전환한다. STUDIO는 삭제하지 않고 멤버십만 제거한다.
- 갤러리 생성 요청은 현재 `workspaceId`를 명시한다.

## 초대

- `STUDIO_MEMBER`와 `PERSONAL_PARTNER`는 작업공간 MEMBER, `GALLERY_MEMBER`는 갤러리 참여로 연결한다.
- 미리보기는 HTTP 200의 `ACTIVE | REVOKED | EXPIRED | ALREADY_MEMBER | FULL` 상태를 반환한다. 수락은 폐기·만료·사용 횟수·정원을 별도로 검사한다.
- `maxUses`, `usedCount`, `remainingUses`와 만료 시각을 보존한다.

## 갤러리와 사진

- 갤러리는 작업공간이 소유하고 `createdByUserId`, `shootType`, 세 상태 축을 기록한다.
- 사진 바이트는 서버를 지나지 않는다. 브라우저가 presigned URL로 객체 저장소와 통신한다.
- 카테고리·분류 작업·셀렉의 모든 사진 참조는 같은 갤러리 안에서만 유효하다.

## 카테고리와 AI

- 카테고리는 `컨셉 → 세부 → 사진 배정` 구조다. PERSONAL OWNER와 STUDIO OWNER/MEMBER가 운영한다.
- 분류 작업은 전체 상태와 별개로 사진별 `PENDING | ASSIGNED | UNCLASSIFIED | FAILED`를 기록한다.
- 제품 서버는 작업 계약을 관리하고 외부 AI 워커가 모델을 실행한다.
- AI 결과는 사용자가 수정할 수 있으며 자동 제출하지 않는다.

## 셀렉과 별점

- 새 갤러리는 `SELECTING` 셀렉 하나와 함께 생성한다.
- 같은 셀렉에 사진이나 정렬 순서를 중복하지 않는다.
- PERSONAL OWNER와 활성 GALLERY_MEMBER가 편집한다. STUDIO 구성원은 조회한다. 편집은 OPEN·마감 전 조건을 확인하며 셀렉 제출 뒤 항목 편집은 잠긴다.
- 제출 철회는 PERSONAL OWNER 또는 STUDIO OWNER/MEMBER가 수행한다. 갤러리 재오픈과 셀렉 제출 철회는 별도 API다.
- 추천은 현재 선택을 보존하고 부족한 후보를 제안한다.

## 협업

- 컨셉당 공유 세션 하나를 두고 현재 배정 사진을 동적으로 노출한다.
- 로그인 사용자와 비로그인 게스트를 통합 참여자로 저장한다.
- `USER`는 `user_id`, `GUEST`는 `guest_token`을 가지며 두 신원은 상호 배타적이다.
- 활성 좋아요는 세션·사진·참여자당 하나다.
- PERSONAL/STUDIO OWNER, 활성 GALLERY_MEMBER와 정상 게스트가 반응을 작성한다. STUDIO MEMBER는 조회만 한다.
- Bearer가 있으면 우선 해석하고 잘못된 Bearer는 `401`이다.

## 보정

- PERSONAL OWNER와 활성 GALLERY_MEMBER가 요청·주석을 작성하고 제출한다.
- STUDIO OWNER/MEMBER와 최고 관리자가 결과 업로드·회차 완료를 담당한다. 공개 완료 API는 갤러리를 DELIVERY 단계로 옮기고 납품 시각·동의·메모는 관리자 경로에서 기록한다.
- 정책은 제출 시점의 셀렉 리비전 고정이다. 현재 공개 제출 API는 이를 기록하지 않고 관리자 변경·납품 경로에서 연결한다. [구현 차이](../implementation-status.md)를 해결 전까지 공개 경로의 보장으로 쓰지 않는다.

## 삭제·감사와 운영

- 일반 삭제는 7일 휴지통으로 이동한다. 삭제 시각부터 7일 경과 후(8일 차) purge가 DB·S3를 정리하며 작업 지연·재시도는 별도로 추적한다.
- 최고 관리자 변경은 관리자 세션, 사유, 멱등 키, 예상 버전과 감사 로그를 요구한다.
- Tailnet 443은 BackOffice 진입점이다. 브라우저 요청은 동일 출처 BFF를 거쳐 비공개 관리자 API로 전달하며 공개 ALB에는 관리자 API를 노출하지 않는다.


세부 PK/FK/UK/CHECK는 [데이터 모델](../data-model/index.md)에서 기능별로 확인한다.

{: .warning }
PERSONAL 권한은 정책과 구현에 차이가 있다. 현재 서버는 초대된 PERSONAL MEMBER도 관리·고객 편집 권한으로 통과시킨다. 위 OWNER 중심 정책을 실제 접근 제한으로 단정하지 않는다. [확인한 구현 차이](../implementation-status.md)를 따른다.
