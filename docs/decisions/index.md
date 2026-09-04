---
title: 기술 결정 (ADR)
nav_order: 7
has_children: true
---

# 기술 결정 (ADR)

주요 기술 의사결정을 ADR (Architecture Decision Record) 형식으로 기록한다. 각 문서는 결정 당시의 **맥락 → 결정 → 근거 → 결과(트레이드오프 포함)** 순서로 쓰여 있어, 상황이 바뀌었을 때 "왜 이렇게 했더라"를 다시 꺼내볼 수 있다.

| # | 결정 | 상태 |
|:---|:---|:---|
| [001](adr-001-presigned-direct-upload.md) | 이미지 바이트는 앱 서버를 지나지 않는다 — presigned 직접 업로드 | 채택 |
| [002](adr-002-preview-derivatives.md) | 원본이 아니라 파생본을 보여준다 | 채택 (규격은 부분 구현) |
| [003](adr-003-category-to-similarity.md) | 카테고리 분류를 버리고 유사도 스택으로 | ADR-009로 대체 |
| [004](adr-004-pgvector-union-find.md) | 벡터 저장은 pgvector, 클러스터링은 Union-Find | ADR-009로 대체 |
| [005](adr-005-monolith-vertical-slice.md) | 모놀리스 + 도메인 수직 슬라이스 | 채택 |
| [006](adr-006-keyless-deploy.md) | 장기 자격증명 없는 배포 파이프라인 | 채택 |
| [007](adr-007-embedder-single-job.md) | 임베딩·파생본·EXIF를 한 번의 잡으로 | ADR-010으로 대체 |
| [008](adr-008-contextual-roles-workspaces.md) | 전역 역할 대신 컨텍스트 권한과 다중 작업공간 | 채택 |
| [009](adr-009-gallery-category-model.md) | 갤러리 귀속 카테고리와 사진별 분류 결과 | 채택 |
| [010](adr-010-external-ai-worker.md) | 제품 서버와 AI 워커 저장소·배포 경계 분리 | 채택 |
| [011](adr-011-private-admin-network.md) | BackOffice와 관리자 API를 Tailnet으로 제한 | 채택 |
| [012](adr-012-remove-album-feature.md) | 앨범 기능과 레거시 모델 제거 | 채택 |
