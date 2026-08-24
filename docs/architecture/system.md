---
title: 3. System — 시스템 구성
parent: 아키텍처
nav_order: 3
---

# System Architecture — 시스템 구성

논리 서비스 구조와 실행 인프라의 결합 — 동기 UI/API · 비동기 AI 사진 처리 · 데이터/스토리지를 한 장에 겹쳐 그린 다이어그램입니다. Application(논리)과 Infrastructure(물리)의 중간 계층입니다.

<div class="wes-arch" data-arch="system" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/system.png">JavaScript가 꺼져 있습니다 — 정적 PNG로 보기</a></noscript>
</div>

[drawio 원본 PNG로 보기]({{ site.baseurl }}/assets/img/architecture/system.png){: .fs-3 }

## 읽는 법

- 왼쪽부터 **클라이언트 → 엣지·전송 → 애플리케이션·컴퓨트 → 데이터·저장 → 관측**의 5개 레인입니다.
- **노드에 마우스를 올리면** 그 구성요소와 직접 연결된 것들만 남고 나머지는 흐려집니다. 예를 들어 **S3**에 올려 보면 이미지 바이트를 실제로 만지는 주체가 브라우저(presigned 직접 업로드·열람)와 Lambda embedder뿐이라는 것 — 이 시스템의 핵심 원칙 — 이 한눈에 보입니다.
- 실선은 동기 요청, 파선은 비동기, 회색은 데이터/스토리지 I/O입니다 (하단 범례 참고).
- 점선 테두리에 **예정** 배지가 붙은 노드(CloudFront, Step Functions + Batch, SQS, Grafana)는 목표 설계에만 있고 아직 구현되지 않은 부분입니다.

## 목표 설계와 현재 구현의 차이

**예정** 배지가 붙은 항목들이 왜 아직 없는지 — 간극의 배경입니다. 현재 실제 배포 상태는 [Infrastructure](infrastructure.md)에서 확인할 수 있습니다.

| 다이어그램 (목표) | 현재 구현 | 배경 |
|:---|:---|:---|
| Step Functions + AWS Batch(GPU) AI 워크플로 | **갤러리 단위 Lambda 1회 비동기 호출** | MVP 규모에서는 워크플로 오케스트레이션 없이 단일 잡으로 충분 → [ADR-007](../decisions/adr-007-embedder-single-job.md) |
| CloudFront + WAF 엣지 | ALB 직결 (CDN 미도입) | 파생본 로딩의 남은 병목이 네트워크임이 측정으로 확인되어 CDN은 후속 과제 → [PoC](../tech/poc.md) |
| Prometheus + Loki + Grafana | **Loki 로그 수집까지 구축** (Grafana Alloy 사이드카) | 모니터링 서버 구축은 Linear 백로그 프로젝트로 대기 중 |

{: .note }
목표와 현재를 다이어그램 하나에 함께 그려 두는 이유: **예정 배지가 곧 로드맵**이기 때문입니다. 구현되면 배지만 떼면 됩니다.

다음 줌 → [Infrastructure — AWS 토폴로지](infrastructure.md)
