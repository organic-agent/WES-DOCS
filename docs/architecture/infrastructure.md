---
title: 4. Infrastructure — AWS 토폴로지
parent: 아키텍처
nav_order: 4
---

# Infrastructure — AWS 토폴로지

공개 요청은 ALB, 관리자 요청은 Tailnet으로 진입한다. Terraform은 `dns`와 앱 스택을 나누며 앱은 10개 모듈을 사용한다.

## 리소스와 경계

| 영역 | 현재 구성 |
|:---|:---|
| 사용자 Web | Next.js / Vercel, AWS 외부 호스팅 |
| 공개 API | Route 53 DNS → ALB :443 → EC2 `wes-api` :8080, API는 ALB 보안 그룹만 허용 |
| 데이터베이스 | Private Single-AZ RDS PostgreSQL/pgvector :5432, API·관리자·AI가 접근 |
| 사진 | 브라우저 ↔ S3 Presigned PUT/GET, 원본·preview·retouch, SSE-S3(AES256) |
| AI 실행 | DB subnet의 Embedder·Score·Categorize Lambda 3개, 인터넷 경로 없음 |
| AWS 내부 접근 | S3 Gateway Endpoint, Lambda·Bedrock Runtime Interface Endpoint |
| 관리자 | Tailnet member/tagged :443 → Tailscale Serve TCP 전달 → localhost Caddy TLS :8443 → Next.js BFF → Docker 내부 `wes-admin-api` :8081 |
| 관리자 노출 | 전용 EC2, 보안 그룹 ingress 0, 공개 ALB 제외, Funnel 미사용 |
| 관측 | 별도 EC2의 Loki·Grafana/Caddy, Lambda CloudWatch 로그·지표 |
| 배포 | 공개 API·관리자 API·BackOffice·AI의 GitHub OIDC 역할과 배포 경로 분리 |

관리자 EC2의 공인 IP는 외부 통신에 사용하며 관리자 API의 공개 진입점이 아니다. BFF에는 AWS 자격 증명이 없고 관리자 API는 필요한 AWS 접근용 런타임 네트워크를 별도로 가진다.

현재 구성에는 CloudFront·WAF·EventBridge·Step Functions·AWS Batch·SQS DLQ를 넣지 않는다. 업로드 완료와 분석 요청은 별도이며 S3 Object Created 이벤트로 분석을 시작하지 않는다.

---

## 상태·비밀값과 배포 순서

- Terraform app/dns는 S3 state 키와 native lock을 분리한다.
- public/admin/monitoring의 Parameter Store 경로를 분리하며 비밀값은 수동 SecureString으로 공급한다. 실제 경로·계정·객체 키는 공개 문서에 싣지 않는다.
- 공개 API의 Flyway·health 확인 → 관리자 API → BackOffice 순서로 반영한다.
- AI 모델 코드는 별도 저장소에서 ECR/Lambda로 배포한다. 제품 API 배포가 모델 버전을 함께 갱신하지 않는다.

기준은 Infra `cfbd72e`와 AI `d256875`의 소스다. 과거 apply 결과와 현재 운영 실측은 [인프라와 배포](../tech/infra.md)·[구현 기준](../implementation-status.md)에서 구분한다.

---

## 승인된 상세 아키텍처

기존 Draw.io의 도형·색상·글꼴·배치를 유지한 2026-09-05 원본이다. 이미지를 누르면 전체 크기로 볼 수 있다.

[전체 이미지]({{ site.baseurl }}/assets/img/architecture/wes-infrastructure-architecture.png) · [Draw.io 원본]({{ site.baseurl }}/assets/diagrams/wes-infrastructure-architecture.drawio)

[![Infrastructure 상세 아키텍처]({{ site.baseurl }}/assets/img/architecture/wes-infrastructure-architecture.png)]({{ site.baseurl }}/assets/img/architecture/wes-infrastructure-architecture.png)
{: .architecture-preview }
