---
title: 셀렉션·추천
parent: 데이터 모델
nav_order: 3
---

# 셀렉션·추천

셀렉은 갤러리 생성 시 함께 생기는 단일 공동 편집 결과다. 추천은 제출이 아니라 수정 가능한 초안이다.

## 기능과 책임

- `PHOTO_SELECTIONS`는 갤러리의 현재 셀렉 상태를 저장한다.
- `PHOTO_SELECTION_ITEMS`는 사진, 작성자와 정렬 순서를 저장한다.
- `PHOTO_RATINGS`는 사진별 공동 별점을 저장한다.
- `AI_SELECTION_JOBS`, `AI_RECOMMENDATIONS`, `AI_PAIR_VERDICTS`는 추천 생성과 설명 근거를 저장한다.
- 관리자용 `ADMIN_AI_SELECTION_JOBS`, `ADMIN_SELECTION_REVISIONS`는 운영 재시도와 변경 이력을 저장한다.

## Mermaid ERD

```mermaid
erDiagram
    GALLERIES ||--|| PHOTO_SELECTIONS : initializes
    PHOTO_SELECTIONS ||--o{ PHOTO_SELECTION_ITEMS : contains
    PHOTOS ||--o{ PHOTO_SELECTION_ITEMS : selected
    USERS ||--o{ PHOTO_SELECTION_ITEMS : adds
    PHOTOS ||--o| PHOTO_RATINGS : rated
    USERS ||--o{ PHOTO_RATINGS : rates
    PHOTO_SELECTIONS ||--o{ AI_SELECTION_JOBS : drafts
    AI_SELECTION_JOBS ||--o{ AI_RECOMMENDATIONS : proposes
    PHOTOS ||--o{ AI_RECOMMENDATIONS : candidate
    AI_SELECTION_JOBS ||--o{ AI_PAIR_VERDICTS : explains
    PHOTO_SELECTIONS ||--o{ ADMIN_SELECTION_REVISIONS : audits

    PHOTO_SELECTIONS {
      bigint id PK
      bigint gallery_id UK,FK
      varchar status
      timestamptz submitted_at
      bigint submitted_by_user_id FK
    }
    PHOTO_SELECTION_ITEMS {
      bigint id PK
      bigint gallery_id FK
      bigint selection_id FK
      bigint photo_id FK
      bigint added_by_user_id FK
      int sort_order
    }
    PHOTO_RATINGS {
      bigint id PK
      bigint photo_id UK,FK
      int score
      bigint rated_by FK
    }
```

## 테이블과 주요 컬럼

| 테이블 | 주요 컬럼 | 설명 |
|:---|:---|:---|
| `photo_selections` | `gallery_id`, `status`, `submitted_at`, `submitted_by_user_id` | 갤러리당 하나인 현재 셀렉이다. |
| `photo_selection_items` | `gallery_id`, `selection_id`, `photo_id`, `added_by_user_id`, `sort_order` | 선택 사진과 공동 편집 메타데이터다. |
| `photo_ratings` | `photo_id`, `score`, `rated_by` | 사진별 현재 별점과 마지막 편집 사용자다. |
| `ai_selection_jobs` | `selection_id`, `status`, `requested_count` | 사용자 요청 추천 작업이다. |
| `ai_recommendations` | 작업·사진·점수·순위 | 추천 후보와 순위를 저장한다. |
| `ai_pair_verdicts` | 비교 사진과 판정 근거 | 유사 후보 중 선택 근거를 저장한다. |
| `admin_selection_revisions` | `selection_id`, `revision_number`, `photo_items` | 관리자 변경과 제출 기준을 보존한다. |

## 키와 업무 불변식

- `photo_selections.gallery_id`는 유일하다. 갤러리 생성 트랜잭션에서 `SELECTING` 행을 만든다.
- `photo_selection_items(selection_id, photo_id)`와 `(selection_id, sort_order)`는 중복되지 않는다.
- 항목의 `(gallery_id, selection_id)`와 `(gallery_id, photo_id)` 복합 FK가 교차 갤러리 연결을 막는다.
- `added_by_user_id`는 삭제된 사용자를 보존할 수 있도록 `ON DELETE SET NULL`이다.
- 추천은 현재 선택을 보존하고 부족한 후보만 제안한다. 자동 제출하지 않는다.

## 권한과 상태 전이

- STUDIO 구성원은 셀렉과 별점을 조회하지만 편집하지 않는다.
- PERSONAL OWNER와 활성 GALLERY_MEMBER만 셀렉·별점을 편집한다.
- 상태는 `SELECTING → SUBMITTED`이며, 철회 시 기존 리비전을 보존하고 다시 `SELECTING`으로 돌아간다.

## 구현 SHA

Server `d8b0a8d`, Web `92babf2`, BackOffice `9a21cfb`를 기준으로 한다. 자동 생성·작성자·정렬·교차 참조 차단 구현은 완료했고 운영 배포는 미확인이다.

## 관련 API·ADR

- API: `GET /api/v1/galleries/{galleryId}/photo-selection`, `POST/DELETE /photo-selection/photos`, `POST /photo-selection/submit`, `POST /photo-selection/withdraw`, `PUT/DELETE /photos/{photoId}/rating`
- [사용자·작업공간·갤러리](user-workspace-gallery.md)
- [ADR-010 — 외부 AI 워커 경계](../decisions/adr-010-external-ai-worker.md)
