---
title: "구현 기준과 확인 상태"
nav_order: 9
---

# 구현 기준과 확인 상태

**2026-11-04 확인.** 현재 설명은 원격 main과 소스를 기준으로 하며, develop·미병합 PR·회의 제안은 분리한다. 저장소 기본 브랜치가 develop인 경우도 있어 main을 명시적으로 확인했다.

## 저장소별 기준

| 저장소 | main | 확인한 내용 |
|:---|:---|:---|
| Server | [`497c8af`](https://github.com/organic-agent/organic-agent-server/tree/497c8af193f7629de60f0a482101b560d65917af) | Flyway V1-V45, 모듈 분리·결과 큐 계약·쿠폰·CDN·Postgres 리더·선택/별점 변경 조회 |
| Web | [`a2b610a`](https://github.com/organic-agent/organic-agent-web/tree/a2b610a) | 개인 흐름, PDF·쿠폰, 필터·단계 이동·공유 범위, 체험·이벤트 측정 |
| AI | [`74a6cdf`](https://github.com/organic-agent/organic-agent-ai/tree/74a6cdf) | Embedder·Embedwriter·GPU Score·Categorize, 서버 조정 파이프라인 |
| Infra | [`b751acf`](https://github.com/organic-agent/organic-agent-infra/tree/b751acf) | ASG·결과 큐·미리보기 CDN·RDS 보호·관측 권한 |
| BackOffice | [`c0b67a8`](https://github.com/organic-agent/organic-agent-backoffice/tree/c0b67a8) | 쿠폰 정책·지정 코드·마감·사용 이력 |

---

## 완료로 쓰지 않는 것

| 항목 | 실제 확인 상태 |
|:---|:---|
| 선택·별점 실시간 반영 | 서버 [#362](https://github.com/organic-agent/organic-agent-server/pull/362)는 main 반영. 현재 Web 소스에서 `selection-sync` 소비는 확인하지 못함. |
| 개인별 별점 | 10/30 회의 제안. main은 공동 별점 하나와 마지막 작업자. |
| 셀렉 제외·복원 | 서버 [#365](https://github.com/organic-agent/organic-agent-server/pull/365) 미병합, 웹 [#160](https://github.com/organic-agent/organic-agent-web/issues/160) 후속 작업. |
| 사진 라벨·셀렉 도우미 | 서버 V46은 develop, AI [#157](https://github.com/organic-agent/organic-agent-ai/pull/157)은 미병합 종료·기본 비활성. 라벨 품질 검수와 웹 연결도 남음. |
| 관리자 단순화 | Server develop [`a2cb8a5`](https://github.com/organic-agent/organic-agent-server/tree/a2cb8a5), BackOffice develop [`ef05279`](https://github.com/organic-agent/organic-agent-backoffice/tree/ef05279). V47-V49·감사/사유/복원 제거를 main 기능으로 쓰지 않음. |
| 선호 학습 적용 | AI에 학습 코드가 있지만 현재 서버는 미사용 `preference_models`를 V33에서 제거. 추천 개인화가 상용 적용된 것으로 쓰지 않음. |
| 결제·외부 알림 | Pro 쿠폰은 제공. 카드 결제·환불·이메일/브라우저 발송은 별도 범위. |

---

## 근거의 우선순위와 검증 범위

1. **실제 소스·마이그레이션과 병합 대상 브랜치**로 현행 동작을 판단한다.
2. PR·이슈·커밋 메시지는 변경 이유와 구현 범위를 보완한다. develop 병합을 운영 배포와 동일하게 취급하지 않는다.
3. 노션 회의록은 결정·제안 맥락, Linear는 작업 분해·당시 완료 기록으로 사용한다. 조회한 Linear 최신 항목은 9월 23일이므로 10-11월 현행 판정은 GitHub로 보완했다.

이번 작업은 문서·그림을 수정하고 정적 검증·Jekyll 빌드·화면 검수를 수행한다. 운영 DB·AWS 설정·Tailnet·Vercel의 현재 실행 SHA와 전체 제품 E2E를 재검증한 작업은 아니다. 성능 수치는 실험 조건이 다른 기록을 합치지 않으며 이 문서의 SLA로 쓰지 않는다.

[변경 기록과 주요 근거](updates.md) · [제품](product/index.md) · [아키텍처](architecture/index.md)
