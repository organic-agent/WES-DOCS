# WES-DOCS

EasySelect(웨딩 사진 셀렉 서비스) 프로젝트 문서 사이트.

**사이트: <https://organic-agent.github.io/WES-DOCS/>**

## 어떻게 동작하나

- GitHub Pages **네이티브 Jekyll 빌드**를 사용한다. 로컬 빌드 도구 없이 `main`에 push하면 자동으로 빌드·배포된다.
- 테마는 [just-the-docs](https://just-the-docs.com)를 `remote_theme`으로 사용한다 (`_config.yml`에 태그 핀).
- 빌드 성공 여부는 repo **Actions 탭의 "pages build and deployment"** 워크플로에서 확인한다. 빌드가 깨져도 로컬에서는 아무 신호가 없다.

## 문서 추가하는 법

1. `docs/<섹션>/` 아래에 `.md` 파일을 만든다.
2. front matter에 `title`, `parent`(섹션 index의 title과 **정확히 일치**), `nav_order`를 적는다.

```yaml
---
title: Cycle 6 (8/31–9/6)
parent: 스프린트
nav_order: 6
---
```

3. 검증 후 PR을 생성하고 CI를 확인해 병합한다. 사이드바 내비게이션에 자동으로 나타난다.

## 최신 기준과 로컬 동기화

[구현 기준과 확인 상태](docs/implementation-status.md)의 원격 main을 확인하고 본문을 갱신한다. 과거 배포 기록·현재 소스·Web 미연동을 구분한다.

로컬 문서가 사이트보다 오래됐다면 `git status --short`로 미커밋 변경을 먼저 확인한다. 깨끗한 main에서 `git fetch origin`과 `git merge --ff-only origin/main`으로 동기화한다. 변경이 있거나 fast-forward가 불가능하면 덮어쓰지 말고 따로 정리한다.

## 검증

PR은 front matter, 내부 링크, Mermaid 코드 펜스와 Jekyll 빌드를 검사한다. 로컬에서는 다음 명령을 사용한다.

```bash
ruby scripts/validate-docs.rb
bundle exec jekyll build --trace
```

WES-Server 체크아웃과 함께 실행하면 기능별 ERD의 테이블이 Flyway V1→최신 마이그레이션의 텍스트상 최종 목록에 존재하는지, 삭제 대상 테이블이 남지 않았는지 대조한다. 이 검사는 실제 DB 적용·컬럼·FK·카디널리티 검증을 대신하지 않으므로 변경한 관계는 마이그레이션과 서비스를 직접 확인한다.

```bash
ruby scripts/validate-docs.rb --server ../WES-Server
```

실행 중인 서버에서 받은 OpenAPI JSON이 있으면 문서에 적은 절대 API 경로도 함께 대조한다.

```bash
ruby scripts/validate-docs.rb --server ../WES-Server --openapi /tmp/openapi.json
```

## 집필 규칙

- **Liquid 충돌 주의**: 본문·코드 블록에 `{{ }}` 또는 `{% %}`가 들어가면 Jekyll이 템플릿으로 해석해 빌드가 깨지거나 내용이 사라진다. 해당 구간을 `{% raw %} … {% endraw %}`로 감싼다.
- **이미지 경로**: 반드시 `{{ site.baseurl }}/assets/img/...` 패턴을 쓴다 (프로젝트 페이지라 baseurl이 붙는다).
- **페이지 간 링크**: 상대 `.md` 경로로 쓴다 (`[제품](../product/index.md)`) — jekyll-relative-links가 URL로 변환한다.
- **대형 Mermaid 금지**: mermaid 기본 maxTextSize를 넘는 다이어그램(수백 클래스)은 렌더에 실패한다. 발췌해서 싣고 전체는 원본 저장소로 링크한다.
- **`.nojekyll` 파일 생성 금지**: 빌드 자체가 꺼진다.
- **공개 저장소**: 운영 실값(시크릿 경로, DB 계정, 버킷명 등)은 적지 않는다. "무엇을 왜"만 기록한다.

## 다이어그램

상세 아키텍처는 WES-PM에서 승인한 Draw.io 원본과 PNG를 그대로 복사해 관리한다. `assets/diagrams/`에 원본·SHA-256 목록, `assets/img/architecture/`에 검토 이미지를 두고 네 아키텍처 페이지에서 연결한다. 원본의 스타일·배치를 변경할 때는 WES-PM에서 먼저 검수한다.

Mermaid는 아키텍처 요약과 기능별 데이터 모델에 사용한다. 변경할 때 본문·컬럼·관계·권한을 함께 대조하고 렌더링을 확인한다. `assets/js/mermaid-hover.js`가 호버 강조를 제공한다.
