---
title: 기능별 정책
parent: 제품
nav_order: 3
---

# 기능별 정책

정책은 애플리케이션 권한과 데이터베이스 제약을 함께 만족해야 한다.

## 작업공간과 소유권

- 사용자는 PERSONAL 작업공간 하나를 소유하고 여러 STUDIO에 참여할 수 있다.
- STUDIO는 여러 OWNER를 허용한다. 마지막 OWNER의 강등·탈퇴·회원 탈퇴·관리자 삭제는 `409`다.
- 회원 탈퇴는 PERSONAL과 소유 갤러리를 삭제 대상으로 전환한다. STUDIO는 삭제하지 않고 멤버십만 제거한다.
- 갤러리 생성 요청은 현재 `workspaceId`를 명시한다.

## 갤러리와 사진

- 갤러리는 작업공간이 소유하고 `createdByUserId`, `shootType`, 세 상태 축을 기록한다.
- 사진 바이트는 서버를 지나지 않는다. 브라우저가 presigned URL로 객체 저장소와 통신한다.
- 카테고리·분류 작업·셀렉의 모든 사진 참조는 같은 갤러리 안에서만 유효하다.

## 카테고리와 AI

- 카테고리는 `컨셉 → 세부 → 사진 배정` 구조다.
- 분류 작업은 전체 상태와 별개로 사진별 `PENDING | ASSIGNED | UNCLASSIFIED | FAILED`를 기록한다.
- 제품 서버는 작업 계약을 관리하고 외부 AI 워커가 모델을 실행한다.
- AI 결과는 사용자가 수정할 수 있으며 자동 제출하지 않는다.

## 셀렉과 별점

- 새 갤러리는 `SELECTING` 셀렉 하나와 함께 생성한다.
- 같은 셀렉에 사진이나 정렬 순서를 중복하지 않는다.
- PERSONAL OWNER와 활성 GALLERY_MEMBER가 편집한다. STUDIO 구성원은 조회한다.
- 추천은 현재 선택을 보존하고 부족한 후보를 제안한다.

## 협업

- 로그인 사용자와 비로그인 게스트를 통합 참여자로 저장한다.
- `USER`는 `user_id`, `GUEST`는 `guest_token`을 가지며 두 신원은 상호 배타적이다.
- 활성 좋아요는 세션·사진·참여자당 하나다.
- PERSONAL/STUDIO OWNER, 활성 GALLERY_MEMBER와 정상 게스트가 반응을 작성한다. STUDIO MEMBER는 조회만 한다.
- Bearer가 있으면 우선 해석하고 잘못된 Bearer는 `401`이다.

## 보정

- PERSONAL OWNER와 활성 GALLERY_MEMBER가 요청·주석을 작성하고 제출한다.
- STUDIO OWNER/MEMBER와 최고 관리자가 결과 업로드·완료·납품을 담당한다.
- 제출 시점의 셀렉 리비전을 보정 회차에 고정한다.

## 삭제·감사와 운영

- 제품 삭제는 논리 삭제 후 복원 창과 purge 상태를 거친다.
- 최고 관리자 변경은 관리자 세션, 사유, 멱등 키, 예상 버전과 감사 로그를 요구한다.
- BackOffice와 관리자 API는 공개 ALB가 아니라 Tailnet 443으로만 제공한다.

{: .decision }
앨범 기능은 삭제했다. 현재 서버·웹·BackOffice에 앨범 호환 API나 화면을 두지 않는다.

세부 PK/FK/UK/CHECK는 [데이터 모델](../data-model/index.md)에서 기능별로 확인한다.
