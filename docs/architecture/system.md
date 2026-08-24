---
title: 3. System — 시스템 구성
parent: 아키텍처
nav_order: 3
---

# System Architecture — 시스템 구성

논리 서비스 구조와 실행 인프라의 결합 — 동기 UI/API · 비동기 AI 사진 처리 · 데이터/스토리지를 한 장에 겹쳐 그린 다이어그램입니다. Application(논리)과 Infrastructure(물리)의 중간 계층입니다.

[원본 크기로 보기]({{ site.baseurl }}/assets/img/architecture/system.png){: .btn .btn-outline .fs-3 }

![System Architecture]({{ site.baseurl }}/assets/img/architecture/system.png){: .arch-diagram }

## 읽는 법

- **클라이언트** — 웹 브라우저 4종: 사진작가 / 부부(각자 계정) / 게스트(URL+토큰+닉네임) / 방문자
- **엣지** — CloudFront(CDN) → Route 53 → WAF → ALB, OAuth는 카카오·구글·네이버 IdP에 위임
- **Application Backend** — EC2 위 모듈형 단일 앱. 인증·권한 / 스튜디오·갤러리 / 사진·폴더 / 셀렉 / 협업·반응 / 알림 / 앨범·목업(논리) / 보정 요청(논리) 8개 논리 서비스
- **데이터** — S3(원본 + 표시용 파생본) / RDS PostgreSQL
- **비동기 AI 파이프라인** — `PhotoUploaded`, `AISelectionRequested` 이벤트로 트리거되는 워크플로와 실패 재처리(DLQ)
- **Observability** — 메트릭 · 로그 · 대시보드

핵심 경로 두 개가 화살표 라벨로 표시되어 있습니다: **"Presigned URL로 사진 직접 업로드"** (이미지 바이트가 앱을 우회) 와 비동기 이벤트 점선 (AI 처리가 요청-응답 밖에서 일어남).

## 목표 설계와 현재 구현의 차이

이 다이어그램은 **목표 시스템 설계**입니다. 2026-08 현재 실제 배포된 상태([Infrastructure](infrastructure.md))와는 세 가지가 다릅니다.

| 다이어그램 (목표) | 현재 구현 | 배경 |
|:---|:---|:---|
| Step Functions + AWS Batch(GPU) AI 워크플로 | **갤러리 단위 Lambda 1회 비동기 호출** | MVP 규모에서는 워크플로 오케스트레이션 없이 단일 잡으로 충분 → [ADR-007](../decisions/adr-007-embedder-single-job.md) |
| CloudFront + WAF 엣지 | ALB 직결 (CDN 미도입) | 파생본 로딩의 남은 병목이 네트워크임이 측정으로 확인되어 CDN은 후속 과제 → [PoC](../tech/poc.md) |
| Prometheus + Loki + Grafana | **Loki 로그 수집까지 구축** (Grafana Alloy 사이드카) | 모니터링 서버 구축은 Linear 백로그 프로젝트로 대기 중 |

{: .note }
목표와 현재의 간극을 다이어그램 수정 대신 문서로 관리하는 이유: 이 간극이 곧 로드맵이기 때문입니다.

다음 줌 → [Infrastructure — AWS 토폴로지](infrastructure.md)
