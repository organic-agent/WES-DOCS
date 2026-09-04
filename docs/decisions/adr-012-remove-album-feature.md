---
title: "ADR-012 — 앨범 기능 제거"
parent: 기술 결정 (ADR)
nav_order: 12
---

# ADR-012 — 앨범 기능 제거

| | |
|:---|:---|
| 상태 | 채택 |
| 시기 | 2026-09 |

## 맥락

앨범 템플릿·폴더·목업은 한때 제품 범위에 있었지만 최종 제품 계약에서 명시적으로 제외됐다. 레거시 테이블과 화면을 남기면 카테고리의 `folder`와 앨범의 `folder`가 다시 혼동되고 운영 범위가 불필요하게 넓어진다.

## 결정

앨범 기능을 호환 계층 없이 제거한다. `photo_folder_groups`, `photo_folders`, `photo_folder_items`, `admin_album_templates`를 삭제하고 서버·웹·BackOffice의 앨범 API와 화면을 제거한다. 갤러리 단계의 기존 `ALBUM`은 `DELIVERY`로 전환한다.

## 결과

- 현재 흐름은 `셀렉 → 보정 → 납품`이다.
- 카테고리는 `concept_folders`, `detail_folders`만 사용한다.
- 과거 인터뷰와 스프린트 기록은 당시 자료로 보존하되 현행 기능으로 안내하지 않는다.
- [앨범 기능 제거](../data-model/album-removal.md)가 삭제 범위를 고정한다.

