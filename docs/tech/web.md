---
title: 프론트엔드 — Next.js
parent: 기술 구현
nav_order: 2
---

# 프론트엔드 — Next.js

현재 Web은 [`7bd2c65`](https://github.com/organic-agent/organic-agent-web/tree/7bd2c65724433219a062415016e7d710226e6d20)다. 서버 새 계약을 적용한 변경은 철회됐으므로 작업공간·카테고리·통합 협업 전환을 완료한 것으로 쓰지 않는다.

## 현재 소스

Next.js 16 App Router, React 19, TypeScript 5와 Tailwind CSS 4를 사용하고 Vercel에 배포한다. `/login`, OAuth 콜백, `/invite/[token]`, 온보딩, `/galleries`, 고객 `/gallery`, 게스트 `/guest/[token]` 경로를 가진다.

`src/lib/api`에는 인증·스튜디오·갤러리·초대·사진·폴더·셀렉·별점 클라이언트가 있다. 클라이언트 파일의 존재가 모든 화면의 실연동을 뜻하지 않는다. 고객·게스트 화면에는 로컬 상태와 mock 신원이 남아 있다.

---

## 서버 계약과의 차이

| 영역 | Web main에서 확인한 상태 | 현재 서버 계약 |
|:---|:---|:---|
| 작업공간 | `GalleryResponse.studioId`, 생성 요청에 `workspaceId` 없음 | PERSONAL/여러 STUDIO 조회와 명시적 `workspaceId` |
| 갤러리 단계 | `status` 중심 타입·목록, `stage` 필터 미반영 | 공개 상태와 업무 상태·6단계 `stage` 분리 |
| 카테고리 | 이전 폴더 클라이언트가 남아 새 분류 계약 미연동 | 컨셉·세부 폴더, 사진 배정과 사진별 분류 결과 |
| 셀렉·별점 | API 모듈과 로컬 화면 상태가 함께 남음 | 공동 셀렉, 항목 작성자·정렬과 사진별 공동 별점 |
| 협업 | 게스트 화면 mock 신원과 로컬 반응 | USER/GUEST 참여자, Bearer 우선순위와 권한 검사 |
| 구성원·보정 | 새 구성원 역할·보정 처리 계약 전환 미반영 | 다중 OWNER 관리, 고객 요청·스튜디오 결과 처리 분리 |

삭제된 API를 호출하는 화면은 현재 서버와 일치하지 않는다. 제품·ERD 설명은 서버 계약이며, 실제 Web의 끝까지 동작하는 여정을 보장하지 않는다.

---

## 배포와 검증 범위

`main`을 `7bd2c65`로 복구하고 운영 재배포한 이전 기록을 보존한다. `.github/workflows/vercel-production.yml`은 main push 배포 워크플로이며 철회한 PR의 추가 CI를 현재 체크로 인용하지 않는다.

이번 작업은 Web을 수정·배포하지 않았다. 저장소별 배포 근거는 [구현 기준과 확인 상태](../implementation-status.md)에 있다.
