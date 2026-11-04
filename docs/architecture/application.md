---
title: "2. Application — 화면과 기능"
parent: "아키텍처"
nav_order: 2
---

# Application — 화면과 기능

화면의 작업 단위와 서버의 소유권을 연결한다. 공통 도메인과 공개·관리자 입구는 Gradle 모듈로 나눈다.

| 구성 | 소유하는 것 |
|:---|:---|
| 사용자 Web | 개인·스튜디오·고객·게스트 화면, 업로드, 선택·공유·보정 작성 |
| `wes-domain` | 작업공간·갤러리·사진·폴더·선택·보정·이용권의 공통 정책 |
| `wes-api` | 공개 API·인증과 Flyway 스키마 |
| `wes-admin-api` | 관리자 세션과 운영 API |
| BackOffice / BFF | 내부 운영 화면과 동일 출처 관리자 API 중계 |
| AI 저장소 | Embedder·Writer·Score·Categorize의 모델 실행·결과 기록 |
| Infra 저장소 | 실행 리소스·큐·CDN·DB·접근과 배포 권한 |

공개 기능은 이용권·폴더·셀렉·반응·보정으로 이어진다. 추천은 사용자가 검토할 후보이고 자동 제출하지 않는다. 공유폴더는 컨셉 폴더와 독립적인 사진 목록을 사용한다.

[현재 연결 그림](system.md) · [사용자 흐름](information.md) · [서버 모듈](../tech/server.md) · [관리자 브랜치 차이](../tech/backoffice.md)

과거 자료 : [2026-09 Draw.io]({{ site.baseurl }}/assets/diagrams/wes-application-architecture.drawio) · [당시 PNG]({{ site.baseurl }}/assets/img/architecture/wes-application-architecture.png)
