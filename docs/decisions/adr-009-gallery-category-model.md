---
title: "ADR-009 — 갤러리 귀속 카테고리"
parent: 기술 결정 (ADR)
nav_order: 9
---

# ADR-009 — 갤러리 귀속 폴더

상태 : 채택 · 이름·공유 계약 갱신 2026-10

## 결정

현재 구조는 `concept_folders → detail_folders → detail_folder_assignments`다. 사진은 세부 폴더 하나에 배정되거나 미분류로 남는다. 관련 관계는 갤러리 ID를 포함한 복합 FK로 경계를 지킨다.

AI 실행 결과의 이름표(`concept_assignments`)와 편집 가능한 폴더를 구분한다. V23에서 이름을 정리했고 V17에서 구 분류 작업 테이블을 제거했다. 작업 조정은 서버의 `analysis_jobs`가 담당한다.

## 결과

연사(`burst_id`)와 임베딩 그룹은 AI 내부 신호다. 공유폴더는 별도 `collab_session_photos`를 사용하고 원래 폴더 이동과 독립적이다(V36-V37). 사진 라벨은 속성이므로 단일 소속 폴더와 합치지 않는다.

[폴더 데이터 모델](../data-model/photo-ai-category.md) · [공유폴더](../data-model/collaboration.md) · [용어집](../glossary.md)
