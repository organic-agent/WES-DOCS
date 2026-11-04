---
title: "아키텍처"
nav_order: 5
has_children: true
---

# 아키텍처

제품 흐름과 시스템·AI 실행 경계를 나눠 본다. 2026-11-04의 소스 기준이며 개발 중인 라벨·셀렉 도우미·제외 폴더는 현재 그림에 넣지 않는다.

| 관점 | 문서 | 핵심 질문 |
|:---|:---|:---|
| 사용자 | [Information](information.md) | 사진을 올린 뒤 선택·요청·결과 확인을 어떻게 이어 가는가 |
| 기능 | [Application](application.md) | 웹·공개 API·관리자·AI는 무엇을 소유하는가 |
| 시스템 | [System](system.md) | 요청·사진 바이트·AI 결과·관리자 접근은 어디로 흐르는가 |
| 인프라 | [Infrastructure](infrastructure.md) | 다중 서버·큐·CDN·DB·배포 경계를 어떻게 운영하는가 |

새 그림은 [stack-diagram](https://github.com/caru-ini/stack-diagram)으로 제작했다. 자체 포함 HTML이 편집 원본이고 밝은·어두운 PNG는 검토용 내보내기다. HTML은 별도 네트워크 요청 없이 열 수 있다.

9월 Draw.io 승인본은 각 페이지의 과거 자료 링크로 보존한다. [기존 SHA-256 목록]({{ site.baseurl }}/assets/diagrams/architecture-manifest.json)은 그 스냅샷만 검증하며 새 그림의 기준으로 사용하지 않는다.

[현재 브랜치와 확인 범위](../implementation-status.md) · [AI 처리 상세](../tech/ai-pipeline.md)
