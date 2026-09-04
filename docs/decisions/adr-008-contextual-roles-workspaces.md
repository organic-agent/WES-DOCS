---
title: "ADR-008 — 컨텍스트 역할과 다중 작업공간"
parent: 기술 결정 (ADR)
nav_order: 8
---

# ADR-008 — 컨텍스트 역할과 다중 작업공간

| | |
|:---|:---|
| 상태 | 채택 |
| 시기 | 2026-09 |

## 맥락

가입 경로로 `PHOTOGRAPHER`와 `CLIENT`를 고정하면 한 사용자가 여러 스튜디오에서 일하거나, 자신의 갤러리를 관리하면서 다른 갤러리에 참여하는 관계를 표현할 수 없다. 스튜디오를 사용자 한 명의 속성으로 다루면 공동 소유와 안전한 탈퇴도 구현하기 어렵다.

## 결정

사용자는 로그인 신원만 나타낸다. 업무 권한은 `WORKSPACE_MEMBERS.role`, PERSONAL 소유 관계, `GALLERY_MEMBERS`에서 계산한다. 사용자는 PERSONAL 작업공간 하나를 가지며 여러 STUDIO 작업공간에 참여할 수 있다. STUDIO는 여러 OWNER를 허용하되 마지막 OWNER의 강등·탈퇴·회원 탈퇴를 막는다.

## 결과

- 갤러리는 `studio_id`가 아니라 `workspace_id`를 참조한다.
- 갤러리 생성자는 `created_by_user_id`로 별도 기록한다.
- 회원 탈퇴는 PERSONAL 자산을 삭제 대상으로 전환하지만 STUDIO는 삭제하지 않는다.
- 웹은 `/api/v1/workspaces`에서 현재 작업공간을 선택한다.
- [사용자·작업공간·갤러리 ERD](../data-model/user-workspace-gallery.md)가 키와 권한을 정의한다.

