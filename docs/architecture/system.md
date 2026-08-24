---
title: 3. System — 시스템 구성
parent: 아키텍처
nav_order: 3
---

# System Architecture — 시스템 구성

논리 서비스 구조와 실행 인프라의 결합 — 동기 UI/API · 비동기 AI 사진 처리 · 데이터/스토리지를 한 장에 겹쳐 그린 다이어그램입니다. Application(논리)과 Infrastructure(물리)의 중간 계층입니다.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/system.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/system.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/system.png">JavaScript가 꺼져 있습니다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/system.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/system.png){: .fs-3 }

## 읽는 법

**draw.io 원본 렌더링 그대로**입니다. 요소에 마우스를 올리면 직접 연결된 것만 남고(옅은 강조), 클릭하면 고정됩니다. 드래그 이동 · 휠 줌.

- **Object Storage(S3)에 올려 보면** 이미지 바이트를 실제로 만지는 주체가 누구인지 — 이 시스템의 핵심 원칙 — 이 한눈에 보입니다.
- 실선은 동기 UI/API 호출, 점선은 비동기 이벤트·알림입니다 (원본 하단 범례 참고).
- `PhotoUploaded`, `AISelectionRequested` 같은 이벤트명이 화살표 라벨에 그대로 있습니다.

## 목표 설계와 현재 구현의 차이

이 다이어그램은 **목표 시스템 설계**를 그린 원본입니다. 2026-08 현재 실제 배포 상태([Infrastructure](infrastructure.md))와 다른 부분은 다이어그램을 고치는 대신 여기서 관리합니다 — 이 간극이 곧 로드맵입니다.

| 다이어그램 (목표) | 현재 구현 | 배경 |
|:---|:---|:---|
| Step Functions + AWS Batch(GPU) AI 워크플로 | **갤러리 단위 Lambda 1회 비동기 호출** | MVP 규모에서는 워크플로 오케스트레이션 없이 단일 잡으로 충분 → [ADR-007](../decisions/adr-007-embedder-single-job.md) |
| CloudFront + WAF 엣지 (웹 UI 서빙 포함) | API는 ALB 직결 · **웹 UI는 Vercel 배포** (CDN 미도입) | 파생본 로딩의 남은 병목이 네트워크임이 측정으로 확인되어 CDN은 후속 과제 → [PoC](../tech/poc.md) |
| Prometheus + Loki + Grafana | **Loki 로그 수집까지 구축** (Grafana Alloy 사이드카) | 모니터링 서버 구축은 Linear 백로그 프로젝트로 대기 중 |

{: .note }
목표 다이어그램은 원본 그대로 두고 간극은 이 표로 관리합니다. 항목이 구현되면 표에서 행을 지우는 것이 곧 로드맵 소화입니다.

다음 줌 → [Infrastructure — AWS 토폴로지](infrastructure.md)
