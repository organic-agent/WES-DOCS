---
title: "4. Infrastructure — AWS 토폴로지"
parent: "아키텍처"
nav_order: 4
---

# Infrastructure — AWS 토폴로지

공개 요청은 ALB·ASG, 사진 미리보기는 CloudFront, 관리자 접근은 Tailnet을 사용한다. [전체 연결 그림](system.md)을 먼저 보면 된다.

| 경계 | 현재 소스의 배치 |
|:---|:---|
| AWS 외부 | Vercel 사용자 웹 |
| Public subnet | ALB, 앱 ASG·GPU·관리자 등 EC2. 리소스별 보안 그룹으로 접근 제한 |
| Private DB subnet | RDS PostgreSQL·pgvector, DB 접근 Lambda |
| VPC 밖 실행 | 배치 Embedder. DB 연결 대신 SQS 결과 전송 |
| 저장·전송 | S3, 미리보기용 CloudFront·서명 쿠키, 결과·실패 SQS |
| 내부 관리자 | Tailnet → Serve/Caddy → BackOffice BFF → 관리자 API |
| 관측 | Alloy·Loki·Grafana, CloudWatch 로그·지표 |

관리자 EC2가 public subnet에 있다는 사실은 관리자 API가 인터넷에 공개됐다는 뜻이 아니다. 공개 ALB에 연결하지 않고 보안 그룹 ingress와 Tailnet 진입을 별도로 제한한다. RDS는 현재 Single-AZ이며 API 다중 서버와 DB 고가용성을 혼동하지 않는다.

---

## 운영 변경의 이유

- 임베딩 결과를 Writer에 모아 DB 연결 경쟁을 줄인다.
- 미리보기 고정 주소로 브라우저 캐시를 유지한다.
- ASG 서버를 한 대씩 배포하고 주기 작업은 Postgres 리더 한 대가 실행한다.
- RDS 자동 백업 7일·삭제 보호·최종 스냅샷을 설정한다.

이는 Terraform·소스 기준이다. 현재 운영 리소스의 drift나 장애 복구 실측은 별도다. [배포 상세와 근거](../tech/infra.md) · [검증 범위](../implementation-status.md)

과거 자료 : [2026-09 Draw.io]({{ site.baseurl }}/assets/diagrams/wes-infrastructure-architecture.drawio) · [당시 PNG]({{ site.baseurl }}/assets/img/architecture/wes-infrastructure-architecture.png)
