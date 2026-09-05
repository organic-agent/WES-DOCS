---
title: 4. Infrastructure — AWS 토폴로지
parent: 아키텍처
nav_order: 4
---

# Infrastructure — AWS 토폴로지

Terraform은 `dns` 스택과 앱 스택을 나누며 앱은 10개 모듈을 사용한다. 공개 요청과 관리자 요청은 진입점부터 분리한다.

| 경로 | 현재 구성 |
|:---|:---|
| 공개 API | ALB → 공개 API → RDS |
| 사진 | 브라우저 ↔ S3 presigned 직접 전송 |
| 관리자 | Tailnet member/tagged → wes-admin:443 → Caddy → BackOffice BFF → 비공개 관리자 API |
| AI | 서버가 외부 실행기를 호출하고 분석 결과·단계 진행을 관측 |
| 배포 | GitHub OIDC → 전용 IAM 역할 → SSM → 컨테이너 교체 |
| 관리자 노출 | 공개 ingress 0, Funnel 미사용, 22·8080·8443 직접 접근 차단 |

현재 원격 기준은 Infra `cfbd72e`이며 apply 결과는 추가 0·변경 0·삭제 0이다. 모듈과 배포 순서, 접근 검증 범위는 [인프라와 배포](../tech/infra.md)를 따른다. 배포된 Flyway 이력과 기존 데이터는 보존한다.
