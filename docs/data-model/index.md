---
title: 데이터 모델
nav_order: 4
has_children: true
---

# 데이터 모델

WES 데이터 모델은 `사용자 → 작업공간 → 갤러리`를 소유권의 줄기로 삼고, 갤러리 아래에서 사진·카테고리·셀렉·협업·보정을 분리한다. 이 페이지는 전체를 보여주고, 하위 문서는 기능별 불변식과 권한을 설명한다.

{: .highlight }
2026-09-05 기준 Server `bc8948a`의 V1-V6를 설명한다. BackOffice는 `16b19e8`, Web은 복구된 `7bd2c65`이므로 새 서버 계약의 Web 연동은 미완료다. [구현 기준과 확인 상태](../implementation-status.md)에서 저장소별 근거와 배포 기록을 구분한다.

## 읽는 순서

| 순서 | 문서 | 핵심 질문 |
|:---:|:---|:---|
| 1 | 이 페이지 | 전체 데이터가 어떻게 이어지는가 |
| 2 | [사용자·작업공간·갤러리](user-workspace-gallery.md) | 누가 무엇을 소유하고 접근하는가 |
| 3 | [사진·AI 분석·카테고리](photo-ai-category.md) | 사진을 어떻게 분석하고 분류하는가 |
| 4 | [셀렉션·추천](selection-recommendation.md) | 선택 결과와 추천 초안을 어떻게 보존하는가 |
| 5 | [협업 참여자·댓글·좋아요](collaboration.md) | 로그인 사용자와 게스트를 어떻게 통합하는가 |
| 6 | [보정](retouch.md) | 고객 요청과 스튜디오 결과 처리를 어떻게 분리하는가 |
| 7 | [수명주기·알림](lifecycle-notification.md) | 삭제·복원·알림을 어떻게 추적하는가 |
| 8 | [관리자 인증·감사](admin-auth-audit.md) | 최고 관리자 접근과 감사를 어떻게 보호하는가 |
| 9 | [관리자 운영](admin-operations.md) | 멱등 작업·휴지통·재처리를 어떻게 운영하는가 |

## 전체 ERD

```mermaid
erDiagram
    USERS |o--o| WORKSPACES : owns_personal
    USERS ||--o{ WORKSPACE_MEMBERS : joins
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : has
    WORKSPACES ||--o| STUDIOS : specializes
    WORKSPACES ||--o{ GALLERIES : owns
    GALLERIES ||--o{ PHOTOS : contains
    GALLERIES ||--o{ CONCEPT_FOLDERS : categorizes
    CONCEPT_FOLDERS ||--o{ DETAIL_FOLDERS : contains
    DETAIL_FOLDERS ||--o{ PHOTO_CATEGORY_ASSIGNMENTS : receives
    PHOTOS ||--o| PHOTO_CATEGORY_ASSIGNMENTS : assigned
    GALLERIES ||--|| PHOTO_SELECTIONS : initializes
    PHOTO_SELECTIONS ||--o{ PHOTO_SELECTION_ITEMS : contains
    PHOTOS ||--o{ PHOTO_SELECTION_ITEMS : selected
    GALLERIES ||--o{ COLLAB_SESSIONS : shares
    COLLAB_SESSIONS ||--o{ COLLAB_PARTICIPANTS : admits
    COLLAB_PARTICIPANTS ||--o{ COLLAB_PHOTO_COMMENTS : writes
    COLLAB_PARTICIPANTS ||--o{ COLLAB_PHOTO_LIKES : reacts
    GALLERIES ||--o{ RETOUCH_ROUNDS : requests
    RETOUCH_ROUNDS ||--o{ RETOUCH_PHOTOS : contains
    PHOTOS ||--o{ RETOUCH_PHOTOS : references
```

## 핵심 불변식

- 사용자는 전역 직무 역할을 가지지 않는다. 권한은 작업공간과 갤러리 관계에서 계산한다.
- PERSONAL 작업공간은 사용자 한 명이 소유한다. STUDIO 작업공간은 여러 OWNER를 허용하되 마지막 OWNER를 제거하지 않는다.
- 갤러리는 작업공간이 소유한다. 여러 스튜디오에 참여한 사용자는 현재 작업공간을 명시해 갤러리를 만든다.
- 카테고리·분류 작업·셀렉 항목은 `gallery_id`를 포함한 복합 FK로 다른 갤러리의 행을 참조하지 못한다.
- 갤러리를 만들 때 `SELECTING` 셀렉도 하나 만든다.
- 협업 반응은 `USER | GUEST` 통합 참여자를 참조한다.
- 보정 요청 작성자는 고객 측, 결과 업로드·완료 처리자는 스튜디오 측이다. 납품 기록과 리비전 연결은 관리자 경로이며 공개 API와의 차이는 [구현 상태](../implementation-status.md)에 기록한다.

## 구현 기준과 배포 상태

[구현 기준과 확인 상태](../implementation-status.md)에 저장소별 원격 SHA와 배포 기록을 모은다. ERD의 실선은 물리 FK, 점선은 논리 참조로 읽는다. FK가 없는 참조를 DB가 보장한다고 해석하지 않는다.

사용자와 PERSONAL 작업공간의 1:1은 활성 사용자 생성 규칙이다. 물리 테이블은 STUDIO의 소유자 NULL과 탈퇴·삭제 이력을 함께 저장한다.

## 관련 문서

- [제품 개념](../product/concepts.md)
- [백엔드 구현](../tech/server.md)
- [ADR 목록](../decisions/index.md)
