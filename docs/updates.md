---
title: "변경 기록"
nav_order: 10
---

# 변경 기록

제품이 어떻게 바뀌었는지 핵심만 남긴다. 본문은 현재 계약을 설명하고, 이 페이지는 변경 이유와 근거를 연결한다.

| 시기 | 달라진 점 | 근거 |
|:---|:---|:---|
| 9월 | 공통 진입·스튜디오·초대 고객·게스트와 개인 이용 흐름을 구체화했다. | Linear [WES-296](https://linear.app/organic-agent/issue/WES-296), [WES-298](https://linear.app/organic-agent/issue/WES-298), [WES-299](https://linear.app/organic-agent/issue/WES-299), [WES-301](https://linear.app/organic-agent/issue/WES-301) |
| 10월 초 | 무료·Pro 이용권과 개인 갤러리 흐름, PDF 요청서·ZIP 업로드를 보완했다. | [10/02 개인 사용자 검토](https://www.notion.so/3ecac24a664c80f487c6e143b46ff724), Web [#101](https://github.com/organic-agent/organic-agent-web/pull/101)·[#102](https://github.com/organic-agent/organic-agent-web/pull/102) |
| 10/14-10/20 | 서버 모듈을 물리 분리하고 임베딩 결과 큐·GPU 단계 분리·다중 서버·CDN·RDS 보호를 반영했다. | Server [#309](https://github.com/organic-agent/organic-agent-server/pull/309), Infra [#108](https://github.com/organic-agent/organic-agent-infra/pull/108)·[#125](https://github.com/organic-agent/organic-agent-infra/pull/125)·[#132](https://github.com/organic-agent/organic-agent-infra/pull/132)·[#142](https://github.com/organic-agent/organic-agent-infra/pull/142) |
| 10/22-10/28 | 체험·랜딩과 사용 이벤트 측정을 보완하고 공유 Pro 쿠폰의 정책·마감·이력을 연결했다. | [10/22 회의](https://www.notion.so/401ac24a664c80af9a9ddc56be311380), Web [#146](https://github.com/organic-agent/organic-agent-web/pull/146)·[#151](https://github.com/organic-agent/organic-agent-web/pull/151), Server [#327](https://github.com/organic-agent/organic-agent-server/pull/327) |
| 10/30-11/02 | 필터·공유 범위·단계 이동·개인 내보내기 취소를 웹에 반영하고, 서버에 선택·별점 변경 조회를 추가했다. | [10/30 회의](https://www.notion.so/409ac24a664c8068b1a3c00babd5820a), Web [#154](https://github.com/organic-agent/organic-agent-web/pull/154)·[#155](https://github.com/organic-agent/organic-agent-web/pull/155)·[#157](https://github.com/organic-agent/organic-agent-web/pull/157), Server [#362](https://github.com/organic-agent/organic-agent-server/pull/362) |
| 11/02-11/04 개발 브랜치 | 관리자 감사·복원·사유·마스킹·구 저장소를 단순화하고 코드·API 문서 규칙을 정리했다. | Server [#354](https://github.com/organic-agent/organic-agent-server/pull/354)-[#360](https://github.com/organic-agent/organic-agent-server/pull/360), [#371](https://github.com/organic-agent/organic-agent-server/pull/371) |

## 회의 제안과 구현의 차이

10/30 회의는 개인별 별점, 상대 변경 반영, 별점 복수 필터, 원본을 지우지 않는 제외 폴더, 추천 개선, 단계 되돌리기를 다뤘다. 이 중 필터·단계 이동은 웹 main에 반영됐고 나머지는 API만 반영되거나 후속 작업으로 남았다. 회의의 체크 표시만으로 완료를 판단하지 않는다.

10/02 검토 문서는 당시 위험 목록이다. 이후 해결된 쿠폰·미리보기·내보내기 문제까지 현재 장애로 재인용하지 않는다. [현재 구현 상태](implementation-status.md)에서 남은 작업을 확인한다.

## 이전 기록

[Cycle 1-6](sprints/index.md)은 당시 집계·결정을 보존한 기록이다. 9월 승인 Draw.io도 과거 스냅샷으로 보존하며 최신 구조는 [현재 아키텍처](architecture/index.md)를 따른다.
