---
title: 프론트엔드 — Next.js
parent: 기술 구현
nav_order: 2
---

# 프론트엔드 — Next.js

## 스택

| 항목 | 선택 |
|:---|:---|
| 프레임워크 | Next.js 16 App Router · React 19 · TypeScript 5 |
| 스타일 | Tailwind CSS 4 |
| 디자인 토큰 | style-dictionary + tokens-studio — 피그마와 코드가 같은 토큰 사용 |
| 폰트 | next/font 셀프 호스팅 (Noto Sans KR · Noto Serif KR · Montserrat) |
| 상태 | React hooks + `useSyncExternalStore` — 별도 상태관리 라이브러리 없음 |
| UI | 전부 자체 컴포넌트 — UI 라이브러리 없음 |
| 배포 | Vercel (GitHub Actions 연동) |

---

## 역할별 라우트

화면은 역할별 Route Group으로 나눈다. 상세·비교·앨범 화면은 별도 라우트가 아니라 **워크스페이스 페이지 안의 보기 모드**로 동작한다.

| 라우트 | 화면 |
|:---|:---|
| `/` | 랜딩 (로그인은 랜딩의 모달) |
| `/login` · `/login/oauth2/code/[provider]` | 로그인 · OAuth 콜백 |
| `/invite/[token]` | 부부 초대 링크 랜딩·수락 |
| `/onboarding/studio` · `/onboarding/gallery` | 작가 스튜디오 생성 · 첫 샘플 갤러리 온보딩 |
| `/galleries` · `/galleries/[galleryId]` | 작가 갤러리 목록 · 워크스페이스 (그리드·싱글·비교) |
| `/gallery` | 부부 셀렉 워크스페이스 (그리드·싱글·비교) |
| `/guest/[token]` | 게스트 공유 앨범 |
| `/terms` · `/privacy` | 약관 · 개인정보 처리방침 |

라우트 가까이의 `_components` `_lib` 폴더는 그 화면 전용 코드이고, 여러 화면이 공유하는 것은 `src/components`와 `src/lib`에 둔다.

---

## 디자인 토큰 파이프라인

색·타이포·간격은 `tokens/*.json`(global / light / dark)에 정의하고, style-dictionary 빌드가 CSS 변수 파일(`tokens.css`, `tokens.dark.css`)을 생성한다. 피그마의 토큰과 코드의 토큰이 같은 원천을 공유하므로 디자인 시스템 정합이 파일 diff로 관리된다.

이 문서 사이트의 브랜드 컬러(rose 액센트)도 같은 토큰 파일에서 가져왔다.

---

## 서버 실연동 레이어

`src/lib/api/`가 백엔드 연동의 관문이다 — 인증(`auth`), 갤러리(`galleries`), 사진(`photos` : presigned 발급 · S3 직접 PUT · 완료 통지 · 임베딩 트리거), 폴더·클러스터(`folders`), 초대(`invites`), 스튜디오(`studios`). `src/lib/auth/`는 토큰 저장, 만료 시 자동 재발급, 세션 복원을 담당한다.

Cycle 4 기준으로 끝낸 흐름 :

- OAuth 로그인 → 콜백 → 토큰 저장 → 만료 시 재발급·요청 재시도
- 스튜디오 생성 온보딩 (슬러그 실시간 중복 검증) → Mock 갤러리 생성
- 갤러리 목록·생성·삭제·상태 전환(열기/마감/재오픈), 초대 링크 발급·폐기·멤버 현황
- **3단계 업로드 파이프라인** — presigned 발급 → S3 직접 PUT → 완료 통지, 파일별 진행률·재시도
- 임베딩 트리거와 처리 현황 폴링, 실사진 그리드 (미리보기 준비 상태 · URL 만료 재조회)
- 자동 분류(클러스터) 조회 + 유사성 레벨 슬라이더, 클러스터 고정 → 앨범 생성, 앨범 관리 (이름 변경 · 삭제 · 사진 담기/이동/제거)

부부 갤러리·비교 셀렉·협업·선택앨범 화면은 UI가 먼저 완성되어 있고, 서버 연동은 다음 사이클에서 붙인다. 진행 상황은 [스프린트](../sprints/index.md)에서 사이클 단위로 확인한다.
