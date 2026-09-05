---
title: 사용자·작업공간·갤러리
parent: 데이터 모델
nav_order: 1
---

# 사용자·작업공간·갤러리

사용자는 계정이고, 작업공간은 소유·운영 경계이며, 갤러리는 한 촬영 건의 업무 경계다. 권한은 작업공간·갤러리 관계에서 계산한다.

## 기능과 책임

- `USERS`는 로그인 신원과 프로필을 저장한다.
- `WORKSPACES`는 `PERSONAL | STUDIO` 유형과 이름을 저장한다.
- `WORKSPACE_MEMBERS`는 PERSONAL 소유자·초대 파트너와 STUDIO 구성원의 `OWNER | MEMBER` 권한을 저장한다.
- `STUDIOS`는 STUDIO 작업공간의 공개 프로필을 확장한다.
- `GALLERIES`는 작업공간, 생성자, 촬영 유형과 세 상태 축을 저장한다.
- `GALLERY_MEMBERS`와 `GALLERY_INVITES`는 갤러리 참여와 초대를 저장한다.

## Mermaid ERD

```mermaid
erDiagram
    USERS |o--o| WORKSPACES : personal_owner
    USERS ||--o{ WORKSPACE_MEMBERS : member
    WORKSPACES ||--o{ WORKSPACE_MEMBERS : membership
    WORKSPACES ||--o| STUDIOS : studio_profile
    WORKSPACES ||--o{ GALLERIES : owns
    USERS |o--o{ GALLERIES : creates
    USERS ||--o{ GALLERY_MEMBERS : joins
    GALLERIES ||--o{ GALLERY_MEMBERS : admits
    GALLERIES ||--o{ GALLERY_INVITES : issues

    USERS {
      bigint id PK
      varchar provider
      varchar provider_id "UK with provider"
      varchar nickname
      timestamptz deleted_at
    }
    WORKSPACES {
      bigint id PK
      varchar type
      bigint personal_owner_user_id FK
      varchar name
      timestamptz deleted_at
    }
    WORKSPACE_MEMBERS {
      bigint id PK
      bigint workspace_id FK
      bigint user_id FK
      varchar role
      timestamptz deleted_at
    }
    STUDIOS {
      bigint workspace_id PK,FK
      varchar gallery_url UK
      varchar name
    }
    GALLERIES {
      bigint id PK
      bigint workspace_id FK
      bigint created_by_user_id FK
      varchar status
      varchar workflow_status
      varchar stage
      varchar shoot_type
    }
```

## 테이블과 주요 컬럼

| 테이블 | 주요 컬럼 | 설명 |
|:---|:---|:---|
| `users` | `provider`, `provider_id`, `nickname`, `deleted_at` | OAuth 로그인 사용자다. 전역 업무 역할은 없다. |
| `workspaces` | `type`, `personal_owner_user_id`, `name` | PERSONAL 또는 STUDIO 소유 경계다. |
| `workspace_members` | `workspace_id`, `user_id`, `role` | PERSONAL OWNER/초대 MEMBER와 STUDIO의 다중 OWNER/MEMBER를 표현한다. |
| `studios` | `workspace_id`, `gallery_url`, `contact`, `description` | STUDIO 작업공간의 1:1 프로필이다. |
| `galleries` | `workspace_id`, `created_by_user_id`, `status`, `workflow_status`, `stage`, `shoot_type` | 촬영 건과 세 상태 축을 저장한다. |
| `gallery_members` | `gallery_id`, `user_id`, `deleted_at` | 고객 측 갤러리 편집 권한을 저장한다. |
| `gallery_invites` | `gallery_id`, `kind`, `max_uses`, `used_count`, `expires_at`, `revoked_at` | 갤러리 참여 링크 정책을 저장한다. |

## 키와 업무 불변식

- OAuth 신원은 `(provider, provider_id)` 복합 UK다. `provider_id` 단독으로 유일하지 않다.
- `workspaces.personal_owner_user_id`는 PERSONAL에만 존재한다. 활성 PERSONAL은 사용자당 하나이며 STUDIO에서는 NULL이다. 정상 가입 시 PERSONAL과 OWNER 멤버십을 함께 만든다.
- `studios.workspace_id`는 `workspaces.id`와 같은 PK/FK다.
- 활성 `workspace_members(workspace_id, user_id)`는 중복되지 않는다.
- 활성 STUDIO에는 OWNER가 최소 한 명 있어야 한다. 마지막 OWNER의 강등·탈퇴·회원 탈퇴는 `409`다.
- 갤러리는 `studio_id`가 아니라 `workspace_id`를 참조한다. 생성자의 삭제를 허용하므로 `created_by_user_id`는 NULL이 될 수 있다.
- 초대 종류는 `STUDIO_MEMBER | GALLERY_MEMBER | PERSONAL_PARTNER`다. 전자·후자는 작업공간 MEMBER를, GALLERY_MEMBER는 갤러리 참여 행을 만든다.
- 미리보기는 HTTP 200의 `ACTIVE | REVOKED | EXPIRED | ALREADY_MEMBER | FULL`로 상태를 알리고 실제 수락 오류와 구분한다.
- `max_uses`, `used_count`, 남은 사용 횟수·만료를 보존하며 수락 시 사용 횟수와 갤러리 정원을 검사한다. 기존 참여자의 재수락은 참여 정보를 반환한다.
- 회원 탈퇴는 PERSONAL과 그 갤러리를 삭제 대상으로 전환하지만 STUDIO는 삭제하지 않는다.

## 권한과 상태 전이

- STUDIO OWNER만 구성원 역할을 바꾼다. OWNER가 둘 이상이면 OWNER도 탈퇴할 수 있다.
- STUDIO MEMBER는 스튜디오 갤러리를 운영하지만 소유권 정책은 바꾸지 못한다.
- PERSONAL OWNER와 활성 GALLERY_MEMBER가 고객 측 셀렉·별점·보정 요청을 편집한다.
- 갤러리 목록의 화면 단계 필터는 `?stage=`다. 공개 상태 `status`와 혼용하지 않는다.
- 갤러리 상태는 공개 `DRAFT | OPEN | CLOSED`, 업무 `DRAFT | IN_PROGRESS | COMPLETED | ARCHIVED`, 화면 단계 `UPLOAD → SELECTION_IN_PROGRESS → SELECTION_COMPLETED → RETOUCH → DELIVERY → ARCHIVED`로 분리한다.

## 구현 기준

Server `bc8948a`의 V1-V6와 BackOffice `16b19e8` 소스를 기준으로 한다. Web `7bd2c65`의 소비 계약 차이와 배포 확인 범위는 [구현 기준과 확인 상태](../implementation-status.md)에 기록한다.

## 관련 API·ADR

- API: `GET /api/v1/workspaces`, `GET /api/v1/studios/{workspaceId}/members`, `PATCH /api/v1/studios/{workspaceId}/members/{memberId}/role`, `DELETE /api/v1/studios/{workspaceId}/members/me`, `POST /api/v1/galleries`
- [ADR-008 — 컨텍스트 역할과 다중 작업공간](../decisions/adr-008-contextual-roles-workspaces.md)
- [제품 정책](../product/policies.md)

{: .warning }
PERSONAL 권한은 정책과 구현에 차이가 있다. 현재 서버는 초대된 PERSONAL MEMBER도 관리·고객 편집 권한으로 통과시킨다. 위 OWNER 중심 정책을 실제 접근 제한으로 단정하지 않는다. [확인한 구현 차이](../implementation-status.md)를 따른다.
