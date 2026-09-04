---
title: "ADR-009 — 갤러리 귀속 카테고리"
parent: 기술 결정 (ADR)
nav_order: 9
---

# ADR-009 — 갤러리 귀속 카테고리

| | |
|:---|:---|
| 상태 | 채택 |
| 시기 | 2026-09 |
| 대체 | ADR-003, ADR-004의 현행 제품 계약 |

## 맥락

유사도 클러스터와 5단계 슬라이더는 실제 고객 편집 구조와 서버 계약이 어긋났다. 애플리케이션 검증만으로는 다른 갤러리의 사진·폴더·작업을 잘못 연결하는 참조도 DB에서 막지 못했다.

## 결정

현재 분류 구조는 `CONCEPT_FOLDERS → DETAIL_FOLDERS → PHOTO_CATEGORY_ASSIGNMENTS`다. 분류 작업은 `CATEGORIZATION_JOBS`와 사진별 결과로 나누고, 사진 상태를 `PENDING | ASSIGNED | UNCLASSIFIED | FAILED`로 기록한다. 관련 테이블에 `gallery_id`를 넣고 복합 FK로 교차 갤러리 참조를 거부한다.

AI가 만든 결과는 편집 가능한 초안이다. 모델 실행은 [외부 AI 워커](adr-010-external-ai-worker.md)가 담당하고 제품 서버는 작업과 결과 계약을 소유한다.

## 결과

- `photo-clusters`와 유사도 레벨 계약을 제거했다.
- 실패한 사진을 작업 전체 상태 뒤에 숨기지 않는다.
- 컨셉 공유 링크의 사진은 현재 카테고리 배정에서 동적으로 계산한다.
- [사진·AI 분석·카테고리 ERD](../data-model/photo-ai-category.md)가 제약을 정의한다.

