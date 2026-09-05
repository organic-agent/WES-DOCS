---
title: 아키텍처
nav_order: 5
has_children: true
---

# 아키텍처

현재 Server·BackOffice·Infra 소스를 기준으로 사용자 흐름에서 실행 경계까지 설명한다. Web의 서버 계약 차이는 [구현 기준](../implementation-status.md)에서 구분한다.

| 관점 | 문서 | 설명 |
|:---|:---|:---|
| 사용자 | [Information](information.md) | 작업공간·갤러리 관계와 역할별 여정 |
| 기능 | [Application](application.md) | 공개 API·관리자 API·외부 AI의 책임 |
| 시스템 | [System](system.md) | Web·API·DB·S3·관리자 경계 |
| 인프라 | [Infrastructure](infrastructure.md) | AWS 배포 경로와 Tailnet 접근 |

Mermaid 그림은 현재 본문과 함께 관리한다. 데이터 관계는 [전체·기능별 ERD](../data-model/index.md)를 따른다.
