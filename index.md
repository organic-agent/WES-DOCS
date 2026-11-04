---
title: 홈
layout: home
nav_order: 1
permalink: /
---

# EasySelect
{: .fs-9 }

수천 장의 웨딩 사진을 정리하고, 함께 고르고, 보정 요청까지 이어 간다.
{: .fs-6 .fw-300 }

[제품 흐름](docs/product/flows.md){: .btn .btn-primary .mr-2 }
[시스템 구성](docs/architecture/system.md){: .btn .mr-2 }
[최근 변경](docs/updates.md){: .btn }

2026-11-04 업데이트 · [소스 기준과 진행 중인 작업](docs/implementation-status.md)

[![사진 업로드·폴더·셀렉·보정 작성·결과 확인]({{ site.baseurl }}/assets/img/architecture/wes-product-current.png)]({{ site.baseurl }}/docs/product/flows.html)

## 현재 제품

개인 사용자는 무료·Pro 이용권으로 갤러리를 직접 만들고, 스튜디오는 사진을 올린 뒤 부부를 초대한다. AI가 만든 컨셉·세부 폴더를 정리하고, 별점·추천·지인 반응을 참고해 사진을 고른다. 선택한 사진의 보정 내용을 작성하고 요청서를 전달한 뒤 결과를 확인한다.

## 구조를 이해하는 세 가지 기준

- **사진은 저장소로 직접 전송한다.** API는 권한과 상태를 관리하고, 미리보기는 고정 CDN 주소로 제공한다.
- **서버가 작업을 조정하고 AI가 계산한다.** 임베딩 결과는 큐에 모아 DB에 쓰며, 모델 실행은 공개 API와 따로 배포한다.
- **현재 기능과 진행 중인 변경을 구분한다.** main·develop·미병합 제안의 차이는 한 페이지에서 확인한다.

## 문서 지도

| 문서 | 내용 |
|:---|:---|
| [제품](docs/product/index.md) | 역할·흐름·이용권·공유·보정 정책 |
| [아키텍처](docs/architecture/index.md) | 사용자 흐름과 시스템·AI 실행 경계 |
| [기술 구현](docs/tech/index.md) | 서버·웹·AI·인프라·관리자 |
| [데이터 모델](docs/data-model/index.md) | 소유권·사진·셀렉·협업·쿠폰의 주요 관계 |
| [기술 결정](docs/decisions/index.md) | 선택한 구조와 이유 |
| [용어집](docs/glossary.md) | 폴더·연사·라벨 등 공통 어휘 |
| [배경](docs/background/index.md) · [개발 기록](docs/sprints/index.md) | 문제 정의와 이전 사이클 기록 |

원격 저장소·회의록·작업 추적의 근거는 [변경 기록](docs/updates.md)에 연결한다.
