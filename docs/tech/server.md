---
title: "백엔드 — Kotlin/Spring"
parent: "기술 구현"
nav_order: 1
---

# 백엔드 — Kotlin / Spring

서버는 제품 정책과 데이터 스키마를 소유하고, 공개 API·관리자 API·AI 실행기의 책임을 나눈다.

## 모듈과 소유권

| 모듈 | 책임 | 실행 |
|:---|:---|:---|
| `wes-domain` | 공통 엔티티·정책·서비스·외부 어댑터, 공용 테스트 픽스처 | 라이브러리 |
| `wes-api` | 공개 컨트롤러·보안, Flyway 마이그레이션 | 공개 API |
| `wes-admin-api` | 관리자 인증과 운영 API | 비공개 API |

10월 모듈 분리 이후 소스는 각 모듈의 `src/`에 둔다. **Flyway는 `wes-api`만 실행한다.** 관리자 테스트는 공개 API의 마이그레이션 리소스를 사용하며, 관리자 운영 JAR에는 Flyway를 넣지 않는다.

근거 : [서버 #309](https://github.com/organic-agent/organic-agent-server/pull/309).

---

## 기술과 도메인

Kotlin 2.3·JVM 21, Spring Boot 4.1 Servlet MVC, JPA·PostgreSQL 16·pgvector를 사용한다. 스키마는 Flyway가 변경하고 Hibernate는 `validate`로 대조한다. 인증은 Google·Kakao·Naver OAuth와 JWT, 통합 테스트는 JUnit·Testcontainers를 사용한다.

| 영역 | 주요 책임 |
|:---|:---|
| 계정·작업공간 | 로그인, PERSONAL/STUDIO 관계와 접근 권한 |
| 갤러리·사진·폴더 | 업로드 계약, 처리 상태, 컨셉·세부 폴더 |
| 분석 | 대상 배정, 실행기 호출, 진행 관측·실패 복구·폴더 반영 |
| 셀렉·협업·보정 | 공동 선택, 추천 초안, 공유 반응, 요청서와 결과 |
| 이용권·운영 | 무료·Pro 쿠폰, 휴지통, 알림, 관리자 작업 |

패키지는 도메인별로 묶고 `Controller → Service → Repository/외부 어댑터`로 읽는다. AI 모델 추론은 [외부 실행기](ai-pipeline.md)가 맡는다.

---

## 운영에서 달라진 점

- 공개 API는 여러 EC2에서 실행하며 주기 작업은 PostgreSQL 행 임대(lease)를 얻은 리더 한 대가 수행한다. Redis 의존성은 제거했다.
- 이미지 미리보기는 CloudFront 고정 주소와 서명 쿠키를 사용한다. 원본·업로드 URL 계약은 별도로 유지한다.
- 헬스체크를 사용자 요청과 다른 관리 포트에서 처리하고, 서버를 한 대씩 교체한다.
- 분석 조정과 실패 복구를 서버가 관리한다. 10월 20일의 추가 DB 연결 점유 개선(#347)은 develop 변경으로 구분한다.

근거 : [리더 임대 #344](https://github.com/organic-agent/organic-agent-server/pull/344), [미리보기 #337](https://github.com/organic-agent/organic-agent-server/pull/337).

[현재 소스와 개발 브랜치 차이](../implementation-status.md) · [데이터 모델](../data-model/index.md) · [배포](infra.md)
