---
title: 사진·AI 분석·카테고리
parent: 데이터 모델
nav_order: 2
---

# 사진·AI 분석·카테고리

사진은 갤러리에 속하고, AI 결과와 사람이 편집하는 카테고리는 분리한다. 카테고리는 `컨셉 → 세부 → 사진 배정` 3단계다.

## 기능과 책임

- `PHOTOS`는 원본 메타데이터와 S3 키를 저장한다.
- `PHOTO_ANALYSIS`는 외부 AI 워커가 만든 임베딩·기술 품질 결과를 저장한다.
- `AI_ANALYSIS_JOBS`는 외부 워커 실행 상태를 저장한다.
- `CONCEPT_FOLDERS`, `DETAIL_FOLDERS`, `PHOTO_CATEGORY_ASSIGNMENTS`는 편집 가능한 카테고리 트리를 저장한다.
- `CATEGORIZATION_JOBS`, `CATEGORIZATION_JOB_PHOTOS`는 분류 작업과 사진별 결과를 저장한다.

## Mermaid ERD

```mermaid
erDiagram
    GALLERIES ||--o{ PHOTOS : contains
    PHOTOS ||--o| PHOTO_ANALYSIS : analyzed
    GALLERIES ||--o{ AI_ANALYSIS_JOBS : schedules
    GALLERIES ||--o{ CONCEPT_FOLDERS : groups
    CONCEPT_FOLDERS ||--o{ DETAIL_FOLDERS : contains
    DETAIL_FOLDERS ||--o{ PHOTO_CATEGORY_ASSIGNMENTS : receives
    PHOTOS ||--o| PHOTO_CATEGORY_ASSIGNMENTS : assigned
    GALLERIES ||--o{ CATEGORIZATION_JOBS : runs
    CATEGORIZATION_JOBS ||--o{ CATEGORIZATION_JOB_PHOTOS : tracks
    PHOTOS ||--o{ CATEGORIZATION_JOB_PHOTOS : processed

    PHOTOS {
      bigint id PK
      bigint gallery_id FK
      varchar storage_key UK
      varchar status
      varchar preview_key
    }
    DETAIL_FOLDERS {
      bigint id PK
      bigint gallery_id FK
      bigint concept_folder_id FK
      int sort_order
    }
    PHOTO_CATEGORY_ASSIGNMENTS {
      bigint photo_id PK,FK
      bigint gallery_id FK
      bigint detail_folder_id FK
      varchar assigned_source
    }
    CATEGORIZATION_JOB_PHOTOS {
      bigint job_id PK,FK
      bigint photo_id PK,FK
      bigint gallery_id FK
      varchar status
      varchar failure_code
      timestamptz processed_at
    }
```

## 테이블과 주요 컬럼

| 테이블 | 주요 컬럼 | 설명 |
|:---|:---|:---|
| `photos` | `gallery_id`, `storage_key`, `preview_key`, `status`, EXIF 필드 | 원본과 표시용 파생본의 메타데이터다. |
| `photo_analysis` | `photo_id`, `embedding`, 품질 신호, `model_version`, `analyzed_at` | AI 분석 결과다. 제품 서버가 모델을 실행하지 않는다. |
| `ai_analysis_jobs` | `gallery_id`, `mode`, `status`, 시작·종료 시각 | 외부 워커 작업 경계다. |
| `concept_folders` | `gallery_id`, `name`, `sort_order`, `created_source` | 상위 컨셉이다. |
| `detail_folders` | `gallery_id`, `concept_folder_id`, `name`, `sort_order` | 실제 사진을 받는 세부 폴더다. |
| `photo_category_assignments` | `gallery_id`, `photo_id`, `detail_folder_id`, `assigned_source`, `confidence` | 사진의 현재 단일 배정이다. |
| `categorization_jobs` | `gallery_id`, `mode`, `status`, `failure_code` | `INITIAL | INCREMENTAL` 분류 작업이다. |
| `categorization_job_photos` | `gallery_id`, `job_id`, `photo_id`, `status`, `failure_code`, `processed_at` | 사진별 `PENDING | ASSIGNED | UNCLASSIFIED | FAILED` 결과다. |

## 키와 업무 불변식

- `photos(gallery_id, id)`와 각 도메인 `(gallery_id, id)` 복합 키를 FK 대상으로 사용한다.
- `detail_folders(gallery_id, concept_folder_id)`는 같은 갤러리의 컨셉만 참조한다.
- `photo_category_assignments`와 `categorization_job_photos`는 같은 갤러리의 사진·폴더·작업만 연결한다.
- 사진당 활성 카테고리 배정은 하나다. 세부 폴더를 제거하면 해당 사진은 미분류가 된다.
- 앱 서버는 작업을 예약하고 상태를 저장한다. 모델 실행은 외부 AI 워커 저장소의 책임이다.

## 권한과 상태 전이

- STUDIO OWNER/MEMBER가 사진 업로드와 카테고리 구조를 운영한다.
- 고객 측 참여자는 카테고리를 조회하고 셀렉에 사용한다.
- 분류 작업은 `PENDING → ASSIGNED | UNCLASSIFIED | FAILED`를 사진마다 기록한다. 작업 전체 상태만으로 개별 실패를 숨기지 않는다.

## 구현 SHA

Server `bc8948a`, Web `4438237`, BackOffice `16b19e8`을 기준으로 한다. 복합 FK와 사진별 상태를 구현했으며 Server V6와 BackOffice는 운영 배포했다.

## 관련 API·ADR

- API: `POST/GET /api/v1/galleries/{galleryId}/concept-folders`, `POST /category-assignments/move`, `POST /categorization-jobs`, `GET /categorization-jobs/latest`
- [ADR-009 — 갤러리 귀속 카테고리](../decisions/adr-009-gallery-category-model.md)
- [ADR-010 — 외부 AI 워커 경계](../decisions/adr-010-external-ai-worker.md)
