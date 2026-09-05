---
title: 1. Information — 사용자 여정
parent: 아키텍처
nav_order: 1
---

# Information — 사용자 여정

작업공간·갤러리 관계에서 권한을 계산한다. 가입 시 PERSONAL 작업공간 하나를 만들며, 여러 STUDIO에 참여할 수 있다.

{: .note }
이 페이지는 승인된 제품/서버 계약을 설명한다. Web `7bd2c65`는 작업공간·카테고리·통합 협업의 새 계약에 아직 맞춰지지 않았다. [구현 기준](../implementation-status.md)에서 실제 소스와 정책의 차이를 구분한다.

## 역할별 진입과 완료

| 진입 | 주요 흐름 | 완료·예외 |
|:---|:---|:---|
| STUDIO OWNER/MEMBER | 작업공간 선택 → 갤러리 운영 → 업로드·분석·카테고리 → 고객 초대 | 고객 제출 결과 조회 · 보정 결과 업로드/회차 완료 |
| PERSONAL OWNER / 활성 GALLERY_MEMBER | 갤러리 → 공동 셀렉·별점 → 사진/순서 확인 → 최종 제출 | 선택 항목 잠금 · 운영자의 제출 철회 후 재개 |
| USER / GUEST 협업 참여자 | 컨셉 공유 링크 → 신원 확인 → 현재 컨셉 사진의 좋아요·댓글 | 기본 7일 만료 · 공유 해지 시 접근 차단 |
| 최고 관리자 | Tailnet → 관리자 로그인 → BackOffice | 사유·버전·멱등성을 확인한 운영 변경 · 감사 기록 |

STUDIO 구성원은 고객 셀렉을 조회하며 편집하지 않는다. 협업 반응은 OWNER·활성 GALLERY_MEMBER·정상 GUEST가 작성하고 STUDIO MEMBER는 조회한다. 현재 서버가 PERSONAL MEMBER까지 일부 관리·고객 편집 권한을 허용하는 차이는 [제품 정책](../product/policies.md)에 별도로 표시한다.

---

## 흐름에서 분리할 것

- 업로드 : JPEG·PNG·WebP·HEIC/HEIF를 S3에 직접 전송한 뒤 브라우저가 완료 API를 호출한다. 전체 분석은 별도 요청이다.
- 카테고리 : 컨셉 → 세부폴더 → 사진 단일 소속이다. INITIAL은 전체, INCREMENTAL은 미처리 사진을 대상으로 하며 수동 배치를 보존한다.
- 추천 : 사용자가 필요할 때 요청하고 후보를 수락·수정한다. 직접 선택에서도 바로 최종 검토·제출로 진행할 수 있다.
- 제출 : `SUBMITTED`는 선택 항목을 잠근다. 제출 철회와 갤러리 재오픈은 별도이며 재편집에는 OPEN·마감 조건도 필요하다.
- 보정 : 고객 요청 → 스튜디오 결과 업로드·회차 완료 → DELIVERY다. 동의·납품 시각·메모는 관리자 경로에서 기록한다.
- 삭제 : 휴지통 7일 안에는 복구할 수 있다. 복구한 항목은 삭제 흐름에서 벗어나며, 기간이 지난 삭제 대상만 DB·S3 정리로 진행한다.

공개 상태(`DRAFT/OPEN/CLOSED`), 작업 상태, 진행 단계는 별도 축이다. 진행 단계는 `UPLOAD → SELECTION_IN_PROGRESS → SELECTION_COMPLETED → RETOUCH → DELIVERY → ARCHIVED`이며 모든 단계가 자동 전이하는 것은 아니다. 전용 앨범 템플릿·목업·크롭 편집은 현재 범위에서 제거됐다.

---

## 승인된 상세 아키텍처

기존 Draw.io의 도형·색상·글꼴·배치를 유지한 2026-09-05 원본이다. 이미지를 누르면 전체 크기로 볼 수 있다.

[전체 이미지]({{ site.baseurl }}/assets/img/architecture/wes-information-architecture.png) · [Draw.io 원본]({{ site.baseurl }}/assets/diagrams/wes-information-architecture.drawio)

[![Information 상세 아키텍처]({{ site.baseurl }}/assets/img/architecture/wes-information-architecture.png)]({{ site.baseurl }}/assets/img/architecture/wes-information-architecture.png)
{: .architecture-preview }

상세 권한은 [제품 정책](../product/policies.md), 데이터 관계는 [작업공간·갤러리](../data-model/user-workspace-gallery.md)와 [셀렉션·추천](../data-model/selection-recommendation.md)을 따른다.
