---
title: "인프라와 배포"
parent: "기술 구현"
nav_order: 4
---

# 인프라와 배포

공개 API는 ALB 뒤의 EC2 여러 대에서 실행하고, 사진 전송·AI 처리·관리자 접근을 각각 분리한다.

## 현재 구성

| 영역 | 구성과 이유 |
|:---|:---|
| 공개 요청 | Vercel 웹 → ALB → EC2 Auto Scaling Group. 서버 한 대를 교체하는 동안 다른 서버가 요청을 받는다. |
| 사진 업로드 | 브라우저 → S3 직접 PUT. API는 URL·권한·메타데이터를 관리한다. |
| 사진 미리보기 | CloudFront 고정 주소 + 갤러리 범위 서명 쿠키. 같은 사진을 URL 만료마다 다시 받는 일을 줄인다. |
| 데이터 | Private Single-AZ RDS PostgreSQL·pgvector. 운영 설정은 small, 자동 백업 7일·삭제 보호·최종 스냅샷이다. |
| AI | 배치 Embedder는 VPC 밖, 결과 Writer·DB 접근 실행기는 VPC 안. Score는 EC2 GPU를 우선 사용한다. |
| 큐 | 임베딩 결과 SQS·Writer, 실패 호출 SQS와 DLQ를 용도별로 구분한다. |
| 관리자 | 전용 EC2의 BackOffice/BFF·관리자 API. Tailnet으로만 진입한다. |
| 관측 | Alloy → Loki·Grafana, CloudWatch 로그·지표. Grafana CloudWatch 조회 권한도 추가됐다. |

앱 ASG와 GPU는 현재 Terraform에서 public subnet을 사용한다. 이를 private 앱 subnet으로 그리지 않는다. **서브넷 위치와 접근 허용은 별개**이며 공개 API는 ALB를 통해 노출하고 DB는 private subnet에 둔다.

근거 : [ASG 전환 #125](https://github.com/organic-agent/organic-agent-infra/pull/125), [CDN #132](https://github.com/organic-agent/organic-agent-infra/pull/132), [DB 보호 #142](https://github.com/organic-agent/organic-agent-infra/pull/142).

---

## 배포와 주기 작업

1. GitHub Actions가 OIDC로 AWS 단기 자격증명을 받는다.
2. 공개 API 이미지를 배포하고 ASG가 사용할 릴리스 묶음을 남긴다.
3. 서버를 한 대씩 ALB 대상에서 빼고 SSM으로 교체한다. healthy 확인 후 다시 넣으며 실패한 서버는 직전 릴리스로 되돌린다.
4. Flyway는 공개 API가 실행하고 관리자 API·BackOffice는 별도 호스트에서 배포한다. AI 이미지와 Lambda·GPU는 AI 저장소가 배포한다.

헬스체크는 관리 포트의 liveness로 사용자 요청 대기열을 피한다. 여러 API의 스케줄러는 PostgreSQL 리더 임대 한 행으로 조정한다. Redis 공유 캐시와 ElastiCache는 제거했다.

근거 : [롤링 배포 #328](https://github.com/organic-agent/organic-agent-server/pull/328), [리더 전환 #344](https://github.com/organic-agent/organic-agent-server/pull/344), [ElastiCache 제거 #135](https://github.com/organic-agent/organic-agent-infra/pull/135).

---

## 관리자와 설정 경계

Tailnet 443 → Tailscale Serve → Caddy → Next.js BFF → 비공개 관리자 API 순서다. 공개 ALB에 관리자 API를 연결하지 않으며, BFF는 관리자 세션을 중계한다. 네트워크 접근 후에도 별도 로그인이 필요하다.

Terraform은 DNS와 앱 스택을 나누고 S3 state·잠금을 사용한다. 시크릿은 Parameter Store에서 공급하며 실제 경로·계정·버킷명은 문서에 싣지 않는다. 모듈 개수와 임시 튜닝값은 본문 계약으로 고정하지 않는다.

[아키텍처](../architecture/infrastructure.md) · [ADR-006](../decisions/adr-006-keyless-deploy.md) · [ADR-011](../decisions/adr-011-private-admin-network.md) · [확인 범위](../implementation-status.md)
