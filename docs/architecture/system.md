---
title: 3. System — 시스템 구성
parent: 아키텍처
nav_order: 3
---

# System Architecture — 시스템 구성

논리 서비스 구조와 실행 인프라의 결합 — 동기 UI/API · 비동기 AI 사진 처리 · 데이터/스토리지를 한 장에 겹쳐 그린 다이어그램이다. Application(논리)과 Infrastructure(물리)의 중간 계층이다.

{: .warning }
2026-08 목표 설계 스냅샷이다. 현재 AI 모델은 외부 워커 저장소에서 실행하며 공개 API와 관리자 API를 분리한다. 현행 경계는 [AI 파이프라인](../tech/ai-pipeline.md)과 [ADR-011](../decisions/adr-011-private-admin-network.md)을 따른다.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/system.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/system.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/system.png">JavaScript가 꺼져 있다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/system.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/system.png){: .fs-3 }

## 읽는 법

**draw.io 원본 렌더링 그대로**다. 요소에 마우스를 올리면 직접 연결된 것만 남고(옅은 강조), 클릭하면 고정된다. 드래그 이동 · 휠 줌.

- `S3 · 사진 오브젝트`에 올리면 이미지 바이트를 실제로 만지는 주체가 브라우저(presigned 직접 업로드·열람)와 AI 파이프라인뿐이라는 것이 드러난다.
- 실선은 동기 UI/API 호출, 점선은 비동기 이벤트·알림이다 (원본 하단 범례 참고).
- `PhotoUploaded`, `AISelectionRequested` 같은 이벤트명이 화살표 라벨에 그대로 있다.

---

## 목표 설계와 현재 구현의 차이

이 다이어그램은 2026-08의 목표 시스템 설계다. 현재 구현과 다른 부분은 역사적 간극으로 읽는다.

| 다이어그램 (목표) | 현재 구현 | 배경 |
|:---|:---|:---|
| Step Functions + AWS Batch(GPU) AI 워크플로 | **외부 AI 워커 저장소와 서버 작업 계약** | 제품 서버와 모델 런타임을 분리한다 → [ADR-010](../decisions/adr-010-external-ai-worker.md) |
| CloudFront + WAF 엣지 (웹 UI 서빙 포함) | API는 ALB 직결 · **웹 UI는 Vercel 배포** (CDN 미도입) | 파생본 로딩의 남은 병목이 네트워크라는 것을 측정으로 확인했고, CDN은 그때 함께 도입한다 → [PoC](../tech/poc.md) |
| Prometheus + Loki + Grafana | **Loki 로그 수집까지 구축** (Grafana Alloy 사이드카) | 모니터링 서버 구축은 Linear 백로그 프로젝트로 대기 중 |

{: .note }
목표 다이어그램은 역사적 원본으로 보존한다. 현행 구조는 [데이터 모델](../data-model/index.md)에서 갱신한다.

다음 줌 → [Infrastructure — AWS 토폴로지](infrastructure.md)
