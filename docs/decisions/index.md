---
title: 기술 결정 (ADR)
nav_order: 6
has_children: true
---

# 기술 결정 (ADR)

주요 기술 의사결정을 ADR(Architecture Decision Record) 형식으로 기록합니다. 각 문서는 결정 당시의 **맥락 → 결정 → 근거 → 결과(트레이드오프 포함)** 순서로 쓰여 있어, 나중에 상황이 바뀌었을 때 "왜 이렇게 했더라"를 다시 꺼내볼 수 있습니다.

| # | 결정 | 상태 |
|:---|:---|:---|
| [001](adr-001-presigned-direct-upload.md) | 이미지 바이트는 앱 서버를 지나지 않는다 — presigned 직접 업로드 | 채택 |
| [002](adr-002-preview-derivatives.md) | 원본이 아니라 파생본을 보여준다 | 채택 (부분 구현) |
| [003](adr-003-category-to-similarity.md) | 카테고리 분류를 버리고 유사도 스택으로 | 채택 |
| [004](adr-004-pgvector-union-find.md) | 벡터 저장은 pgvector, 클러스터링은 Union-Find | 채택 |
| [005](adr-005-monolith-vertical-slice.md) | 모놀리스 + 도메인 수직 슬라이스 | 채택 |
| [006](adr-006-keyless-deploy.md) | 장기 자격증명 없는 배포 파이프라인 | 채택 |
| [007](adr-007-embedder-single-job.md) | 임베딩·파생본·EXIF를 한 번의 잡으로 | 채택 |
