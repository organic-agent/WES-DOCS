---
title: "ADR-010 — 외부 AI 워커 경계"
parent: "기술 결정 (ADR)"
nav_order: 10
---

# ADR-010 — 외부 AI 워커 경계

상태 : 채택 · 2026-10 구현 반영

## 결정

제품 서버는 작업 상태·대상 배정·재시도와 스키마를 소유한다. AI 저장소는 Lambda와 EC2 GPU에서 모델을 실행하고 허용된 결과만 기록한다. 실행기끼리 다음 단계를 직접 호출하지 않는다.

## 이유와 결과

사진 수천 장의 모델 추론은 API와 실행 환경·배포 주기가 다르다. GPU를 독립적으로 켜고 끄며, 임베딩 적재는 SQS → Embedwriter로 모아 사용자 요청과 DB 연결 경쟁을 줄인다. 폴더용 신호와 화질 점수를 나눠 폴더를 먼저 사용할 수 있게 한다.

9월의 Score → Categorize 체인·`lambda-reports-stage` 설명은 이전 계약이다. 현재 계약은 [AI 파이프라인](../tech/ai-pipeline.md), 근거는 [AI README](https://github.com/organic-agent/organic-agent-ai/blob/74a6cdf/README.md)를 따른다.
