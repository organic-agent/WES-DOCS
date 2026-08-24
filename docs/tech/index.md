---
title: 기술 구현
nav_order: 5
has_children: true
---

# 기술 구현

## 스택 한눈에

| 영역 | 스택 | 저장소 |
|:---|:---|:---|
| 백엔드 | Kotlin 2.3 · Spring Boot 4.1 (Servlet MVC) · JPA + Flyway · PostgreSQL + pgvector · Spring Security + OAuth2 + JWT | `organic-agent-server` |
| 프론트엔드 | Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · style-dictionary 디자인 토큰 · Vercel | `organic-agent-web` |
| AI | Python Lambda (ECR 컨테이너) · DINOv2 768차원 임베딩 · pgvector 코사인 유사도 · Union-Find 클러스터링 | `organic-agent-server` (embedder) |
| 인프라 | Terraform · AWS (VPC / EC2 / RDS / ALB / S3 / Lambda) · GitHub Actions OIDC + SSM Run Command | `organic-agent-infra` |

## 관통하는 원칙

**이미지 바이트는 앱 서버를 지나지 않습니다.** 서버는 presigned URL만 발급하고, 브라우저가 S3에 직접 업로드·다운로드합니다. 이미지를 실제로 여는 곳은 임베딩 Lambda 한 곳뿐이고, 그래서 임베딩·미리보기 파생본·EXIF 추출이 전부 그 한 번의 열림에 얹혀 있습니다. 이 원칙이 각 영역에서 어떻게 구현되는지가 이 섹션의 큰 줄기입니다.

| 페이지 | 내용 |
|:---|:---|
| [백엔드 — Kotlin/Spring](server.md) | 13개 도메인 수직 슬라이스, 레이어 규칙, 컨벤션 체계 |
| [프론트엔드 — Next.js](web.md) | 역할별 라우트, 디자인 토큰 파이프라인, 인증·업로드 실연동 |
| [AI 파이프라인](ai-pipeline.md) | 업로드 → 임베딩 → 클러스터링 전체 흐름과 설계 원칙 |
| [인프라와 배포](infra.md) | Terraform 모듈, keyless 배포, 운영 중 겪은 사건들 |
| [PoC — 설계를 결정한 두 실험](poc.md) | 업로드 방식과 이미지 로딩 전략을 정한 측정 기록 |
