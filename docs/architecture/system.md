---
title: "3. System — 시스템 구성"
parent: "아키텍처"
nav_order: 3
---

# System — 시스템 구성

API 요청·사진 전송·AI 계산·관리자 접근은 서로 다른 경로를 사용한다.

[![현재 시스템의 요청·사진·관리자 경로]({{ site.baseurl }}/assets/img/architecture/wes-system-current.png)]({{ site.baseurl }}/assets/img/architecture/wes-system-current.png)
{: .architecture-preview }

[확대 PNG]({{ site.baseurl }}/assets/img/architecture/wes-system-current.png) · [어두운 PNG]({{ site.baseurl }}/assets/img/architecture/wes-system-current-dark.png) · [편집 가능한 HTML]({{ site.baseurl }}/assets/diagrams/wes-system-current.html)

## 읽는 순서

1. 브라우저의 공개 요청은 ALB를 거쳐 여러 EC2의 `wes-api`로 전달한다. PostgreSQL이 제품 상태와 리더 임대를 저장한다.
2. 사진 업로드는 브라우저 → S3 직접 전송이다. 현재 웹은 큰 JPEG를 축소할 수 있으므로 촬영 원본 보관 서비스로 해석하지 않는다.
3. 미리보기는 CloudFront 고정 주소와 서명 쿠키로 읽는다. 원본·결과 파일 권한과 별도다.
4. 서버가 AI 단계를 호출하고 실행기는 DB·S3에 결과를 기록한다. 모델 실행은 API JVM과 별도 배포다.
5. 관리자는 Tailnet → BackOffice BFF → 비공개 관리자 API로 접근한다. 공개 ALB 경로와 분리한다.

그룹은 실행 책임을 보여 주며 물리 subnet 지도가 아니다. 실제 배치는 [Infrastructure](infrastructure.md)를 따른다.

---

## AI 결과 경로

[![SQS 결과 적재와 서버 조정 AI 처리]({{ site.baseurl }}/assets/img/architecture/wes-ai-current.png)]({{ site.baseurl }}/assets/img/architecture/wes-ai-current.png)
{: .architecture-preview }

[확대 PNG]({{ site.baseurl }}/assets/img/architecture/wes-ai-current.png) · [어두운 PNG]({{ site.baseurl }}/assets/img/architecture/wes-ai-current-dark.png) · [편집 가능한 HTML]({{ site.baseurl }}/assets/diagrams/wes-ai-current.html)

Embedder 결과는 SQS를 거쳐 Writer가 묶어 쓴다. GPU Score와 Categorize는 서버가 각각 호출한다. 폴더 신호가 먼저 준비되고 화질·추천 순위는 뒤따를 수 있다. 실패 큐·관리자 사진 교체 경로는 요약 그림에서 생략했다.

[AI 처리 상세](../tech/ai-pipeline.md) · [확인한 소스](../implementation-status.md)

과거 자료 : [2026-09 Draw.io]({{ site.baseurl }}/assets/diagrams/wes-system-architecture.drawio) · [당시 PNG]({{ site.baseurl }}/assets/img/architecture/wes-system-architecture.png)
