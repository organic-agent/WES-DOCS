---
title: 4. Infrastructure — AWS 토폴로지
parent: 아키텍처
nav_order: 4
---

# Infrastructure Architecture — AWS 토폴로지

실제로 배포되어 있는 AWS 리소스 구성입니다 — **draw.io 원본 렌더링 그대로**이고(2026-08-13, `WES-Infra` 저장소에서 인프라 코드와 함께 관리), 서비스 요청 ①~⑧ 경로와 DNS·설정·배포·state 흐름이 원본의 색 범례로 구분되어 있습니다.

**리소스에 마우스를 올리면 연결된 것만 강조됩니다** (아이콘과 라벨 어느 쪽이든) — **EC2**에 올리면 요청 경로(ALB·RDS)와 설정 로드(Parameter Store), 배포 경로(SSM Run Command)가 함께 드러나고, **GitHub Actions**에 올리면 키 없는 배포 경로(OIDC → IAM 배포 롤 → Run Command)만 남습니다. 클릭하면 고정, 드래그 이동 · 휠 줌.

<div class="drawio-arch"
     data-svg="{{ '/assets/diagrams/interactive/infrastructure.svg' | relative_url }}?v={{ site.github.build_revision }}"
     data-map="{{ '/assets/diagrams/interactive/infrastructure.map.json' | relative_url }}?v={{ site.github.build_revision }}" markdown="0">
  <noscript><a href="{{ site.baseurl }}/assets/img/architecture/infrastructure.png">JavaScript가 꺼져 있습니다 — 정적 PNG로 보기</a></noscript>
</div>

[전체 화면으로 보기]({{ site.baseurl }}/diagrams/infrastructure.html){: .btn .btn-outline .fs-3 .mr-2 }
[정적 PNG]({{ site.baseurl }}/assets/img/architecture/infrastructure.png){: .fs-3 }

## 구성 요약

단일 EC2 · Single-AZ RDS · 사진 S3 버킷 · 임베딩 Lambda로 구성한 **폐기 가능한 테스트 환경**입니다. 운영용 고가용성·백업·삭제 보호는 의도적으로 구성하지 않았습니다.

| 항목 | 구성 |
|:---|:---|
| 요청 경로 | `api.easyselect.kr` → ALB(HTTPS) → EC2 `:8080` → RDS PostgreSQL `:5432` |
| 사진 경로 | 브라우저가 서명 URL로 S3에 **직접** PUT/GET — 사진 바이트가 앱을 거치지 않음 |
| 임베딩 | 앱이 갤러리 단위로 Lambda를 비동기 호출 → Lambda가 S3 게이트웨이 엔드포인트로 원본을 읽어 임베딩 기록 |
| 네트워크 | 2개 AZ의 public/DB 서브넷. DB 서브넷은 인터넷 경로가 없고 S3 게이트웨이 엔드포인트만 연결 |
| 설정 | EC2 앱이 부팅 시 SSM Parameter Store를 읽음. DB 비밀번호는 write-only 전달로 **Terraform state에 값이 남지 않음** |
| 보안 | ALB → EC2 `:8080`(ALB SG만) → RDS `:5432`(EC2·임베더 SG만)로 최소 허용. SSH 기본 차단 |
| 배포 | GitHub Actions `main` → OIDC IAM Role → SSM Run Command → EC2 (**장기 자격증명 0개**) |
| State | 사전 생성 S3 backend에 app/dns 스택 키 분리, S3 native lock |

## 스택이 둘로 나뉜 이유

Terraform 스택은 **dns**와 **app** 둘로 분리되어 있습니다. 앱 스택 전체를 `destroy`해도 Route 53 Hosted Zone과 NS 위임은 dns 스택에 남아, 폐기·재구축을 반복해도 도메인 위임을 다시 만질 필요가 없습니다. "폐기 가능한 테스트 환경"이라는 목표가 스택 구조에 반영된 예입니다.

구현 상세 — Terraform 모듈 구조, 배포 순서 8단계, keyless 배포 파이프라인, 운영 중 겪은 사건들 — 는 [기술 구현 — 인프라와 배포](../tech/infra.md)에 있습니다.
