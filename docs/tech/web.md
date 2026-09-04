---
title: 프론트엔드 — Next.js
parent: 기술 구현
nav_order: 2
---

# 프론트엔드 — Next.js

WES-Web은 로컬 목업이 아니라 현재 `/api/v1` 계약을 사용한다.

## 스택

| 항목 | 선택 |
|:---|:---|
| 프레임워크 | Next.js 16 App Router, React 19, TypeScript 5 |
| 스타일 | Tailwind CSS 4, style-dictionary 디자인 토큰 |
| 인증 | OAuth2/JWT 세션 복원과 요청 재시도 |
| 배포 | Vercel |

## 라우트와 컨텍스트

기존 Route Group 이름은 화면 정리를 위해 남아 있지만 권한은 전역 작가·부부 역할로 판단하지 않는다.

| 라우트 | 책임 |
|:---|:---|
| `/login`, `/login/oauth2/code/[provider]` | 로그인과 OAuth 콜백 |
| `/invite/[token]` | 갤러리 초대 수락 |
| `/onboarding/studio`, `/onboarding/gallery` | STUDIO와 첫 갤러리 생성 |
| `/galleries`, `/galleries/[galleryId]` | 작업공간별 목록과 갤러리 운영 |
| `/gallery` | PERSONAL OWNER·GALLERY MEMBER 셀렉과 보정 요청 |
| `/guest/[token]` | 비로그인 협업 참여 |

## 실제 API 연동

`src/lib/api/`는 `auth`, `workspaces`, `studios`, `galleries`, `invites`, `photos`, `categories`, `selection`, `ratings`, `collab`, `retouch` 모듈로 나눈다.

- `/api/v1/workspaces`에서 PERSONAL과 여러 STUDIO를 조회하고 갤러리 생성에 `workspaceId`를 보낸다.
- 갤러리 목록은 `stage`로 필터링한다.
- 카테고리는 컨셉·세부 폴더, 미분류 사진과 사진별 작업 상태를 표시한다.
- 셀렉·별점·좋아요·댓글은 서버 API를 사용한다. localStorage 목업을 사용하지 않는다.
- 공유 링크는 로그인 시 Bearer 참여자, 비로그인 시 닉네임·게스트 토큰 참여자로 동작한다.
- STUDIO 구성원 목록과 OWNER 승격·강등·탈퇴를 지원한다.
- 앨범과 `photo-clusters` 화면, 유사도 레벨 슬라이더는 제거했다.

## 검증 기준

고정 설치, ESLint, TypeScript 검사와 Next 프로덕션 빌드를 PR CI의 최소 기준으로 둔다. 기준 병합 SHA는 `4438237`이며 PR CI는 통과했고 Vercel 운영 배포를 확인 중이다.
