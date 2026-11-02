---
title: "프론트엔드 — Next.js"
parent: "기술 구현"
nav_order: 2
---

# 프론트엔드 — Next.js

현재 웹은 개인·스튜디오·초대 고객·게스트 흐름을 제공한다. 9월 초의 복구 커밋·새 계약 미연동 설명은 현행 기준에서 제외한다.

## 구성

Next.js 16·React 19·TypeScript·Tailwind CSS 4를 사용하고 Vercel 배포 워크플로를 갖는다. API 클라이언트와 갤러리 화면 상태를 나누며, 개인 이용권·초대·폴더·셀렉·공유·보정 경로를 연결한다.

| 영역 | 최근 반영 |
|:---|:---|
| 업로드 | JPEG 마스터 축소, ZIP·분할 ZIP, 처리 상태 |
| 셀렉 | 별점 복수 선택·별점 없음, 선택 여부·게스트 반응·추천 필터 |
| 폴더 | 단계 메뉴로 정리 화면 재진입, 기존 선택·별점·보정 작성 유지 |
| 공유 | 현재 필터 결과·별점 조건으로 공유 사진 구성 |
| 보정 | PDF 요청서, 보정본 전 내보내기 취소, 결과 화면 폴더 탐색 |
| 이용권 | 무료·Pro와 쿠폰 사용 정책·마감 오류 표시 |
| 유입·측정 | 랜딩의 4단계 설명·체험 화면, Amplitude 이벤트 |

근거 : [쿠폰 #151](https://github.com/organic-agent/organic-agent-web/pull/151), [필터 #154](https://github.com/organic-agent/organic-agent-web/pull/154), [단계 이동 #155](https://github.com/organic-agent/organic-agent-web/pull/155), [폴더 정리 #157](https://github.com/organic-agent/organic-agent-web/pull/157), [체험 #146](https://github.com/organic-agent/organic-agent-web/pull/146).

---

## 연동 상태를 구분한다

선택·별점 변경 번호는 서버 main에 있지만 웹의 `selection-sync` 소비는 이번 소스에서 확인하지 못했다. API 추가만으로 실시간 공동 편집 완료라고 쓰지 않는다. 셀렉 제외 폴더와 도우미 패널도 후속 작업이다.

이 문서는 소스와 PR 기준이다. 현재 배포된 화면의 모든 경로를 브라우저에서 끝까지 검증한 결과는 아니다. [확인 SHA·미완료 작업](../implementation-status.md) · [사용자 흐름](../product/flows.md)
