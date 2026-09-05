---
title: 아키텍처
nav_order: 5
has_children: true
---

# 아키텍처

2026-09-05 WES-PM에서 승인한 네 Draw.io 아키텍처를 기준으로 사용자 여정·기능 책임·시스템·인프라를 설명한다. 원본의 도형·색상·글꼴·배치를 보존했으며 관련 원격 main과 대조했다. Web의 서버 계약 차이는 [구현 기준](../implementation-status.md)에서 구분한다.

| 관점 | 문서 | 설명 |
|:---|:---|:---|
| 사용자 | [Information](information.md) | 작업공간·갤러리 관계와 역할별 여정 |
| 기능 | [Application](application.md) | 공개 API·관리자 API·외부 AI의 책임 |
| 시스템 | [System](system.md) | Web·API·DB·S3·관리자 경계 |
| 인프라 | [Infrastructure](infrastructure.md) | AWS 배포 경로와 Tailnet 접근 |

각 페이지에서 전체 PNG와 편집 가능한 Draw.io 원본을 제공한다. 상세 그림은 승인본을 그대로 복사하며 Mermaid는 본문 요약으로만 관리한다. 데이터 관계는 [전체·기능별 ERD](../data-model/index.md)를 따른다.

[원본·이미지 SHA-256 목록]({{ site.baseurl }}/assets/diagrams/architecture-manifest.json)에서 복사한 파일의 동일성을 확인할 수 있다. 이 목록은 승인된 산출물의 스냅샷이며 WES-PM의 미커밋 파일을 원격 커밋으로 표시하지 않는다.
