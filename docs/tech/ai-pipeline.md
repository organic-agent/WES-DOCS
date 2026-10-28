---
title: "AI 파이프라인"
parent: "기술 구현"
nav_order: 3
---

# AI 파이프라인

서버가 실행 순서·작업 상태·재시도를 관리하고, AI 저장소는 사진 모델 추론과 분류 결과를 만든다. 이전의 Score → Categorize 직접 호출 방식은 폐기됐다.

## 업로드부터 폴더까지

1. 브라우저가 사진을 S3에 직접 올리고 완료 API를 호출한다. 현재 웹은 큰 JPEG를 긴 변 2,048px로 줄일 수 있으므로 업로드 파일을 촬영 원본 보관으로 설명하지 않는다.
2. 서버가 사진을 배정하고 Embedder Lambda를 호출한다. Embedder는 미리보기 JPEG를 먼저 저장한 뒤 그 바이트로 DINOv3 임베딩과 EXIF를 만든다.
3. 임베딩 결과는 SQS 결과 큐로 보낸다. VPC 안의 `embedwriter`가 여러 결과를 묶어 PostgreSQL에 기록한다. 배치 Embedder는 DB에 직접 연결하지 않는다.
4. EC2 GPU 워커가 CLIP·피사체 신호를 먼저 채운다. ARNIQA 등 화질 점수는 두 번째 단계에서 계산한다. GPU를 사용할 수 없는 경로에는 Lambda 폴백이 있다.
5. 서버는 폴더용 신호가 준비되면 Categorize를 호출한다. 촬영 시각 구간·임베딩 그룹과 대표 사진을 사용해 컨셉·세부 이름을 만들고, 서버가 편집 가능한 폴더로 반영한다.
6. 화질 점수가 준비되면 `rank` 모드로 백분위·연사 대표 순위를 채운다. **폴더 완료와 추천 재료 준비 완료는 구분한다.**

[시스템 그림](../architecture/system.md)에서 전체 연결을 볼 수 있다.

---

## 실행기별 책임

| 실행기 | 위치 | 책임 |
|:---|:---|:---|
| Embedder | VPC 밖 Lambda(배치 경로) | 미리보기·DINOv3·EXIF, SQS 결과 전송 |
| Embedwriter | VPC 안 Lambda | 결과를 모아 DB 적재, 메시지별 실패 재시도 |
| Score | EC2 GPU / Lambda 폴백 | CLIP·피사체 우선 처리, 화질 점수 후속 처리 |
| Categorize | Lambda | 연사·촬영 구간·그룹·Bedrock 이름, 후속 순위 계산 |
| 제품 서버 | Kotlin/Spring | 작업 상태·대상 배정·타임아웃·복구·폴더 반영, 추천·비교·보정 문장 정리 |

스키마는 서버 Flyway가 소유한다. AI 실행기는 허용된 결과 컬럼만 쓰고 분석 잡의 상태 전이를 소유하지 않는다. 사용자 별점은 현재 분석 모델 입력으로 사용하지 않는다. 추천은 사용자가 검토할 후보이며 자동 제출하지 않는다.

---

## 실패와 복구

SQS 결과 큐와 Lambda 실패 큐는 용도가 다르다. 전자는 정상 결과를 모아 쓰고, 후자는 실패한 비동기 호출을 서버가 빨리 확인하는 데 사용한다. 서버는 배정 시각과 진행 상태를 관측해 재시도·정체 처리를 수행한다. GPU 워커는 유휴 시 정지한다.

라벨·셀렉 도우미는 별도 작업이다. `photo_labels` 스키마는 개발 브랜치에 있고 AI 라벨 PR은 미병합·기본 비활성 상태다. 선호 학습 코드의 존재도 추천 적용 완료를 뜻하지 않는다. [현재 상태](../implementation-status.md)를 따른다.

근거 : [AI README](https://github.com/organic-agent/organic-agent-ai/blob/74a6cdf/README.md), [운영 결과 큐 #108](https://github.com/organic-agent/organic-agent-infra/pull/108), [점수 단계 분리 #152](https://github.com/organic-agent/organic-agent-ai/pull/152), [후속 rank #150](https://github.com/organic-agent/organic-agent-ai/pull/150).
