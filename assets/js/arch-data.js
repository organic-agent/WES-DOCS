// WES 인터랙티브 아키텍처 다이어그램 데이터
// - lanes: 세로 컬럼 (왼쪽부터). nodes.lane이 여기 id를 참조한다.
// - groups: 레인 안의 컨테이너 박스 (예: 서브넷). 선택 사항.
// - nodes: kind = client | ext | aws | app | data | obs, status: 'planned'면 점선 + 예정 배지.
// - edges: kind = sync(실선) | async(파선) | data(회색) | deploy(점선 녹색), status: 'planned' 지원.
// 렌더링과 상호작용은 arch-diagram.js가 담당한다.
window.WES_ARCH_DATA = {
  system: {
    minWidth: 1040,
    lanes: [
      { id: 'client', title: '클라이언트' },
      { id: 'edge', title: '엣지 · 전송' },
      { id: 'compute', title: '애플리케이션 · 컴퓨트' },
      { id: 'data', title: '데이터 · 저장' },
      { id: 'obs', title: '관측' }
    ],
    groups: [],
    nodes: [
      { id: 'visitor', lane: 'client', kind: 'client', title: '방문자', desc: '랜딩 · 가입' },
      { id: 'photographer', lane: 'client', kind: 'client', title: '사진작가', desc: '갤러리 운영 · 업로드' },
      { id: 'couple', lane: 'client', kind: 'client', title: '부부', desc: '각자 계정으로 셀렉' },
      { id: 'guest', lane: 'client', kind: 'client', title: '게스트', desc: 'URL + 토큰 · 계정 없음' },

      { id: 'vercel', lane: 'edge', kind: 'ext', title: 'Vercel', desc: 'Next.js 웹 UI' },
      { id: 'route53', lane: 'edge', kind: 'aws', title: 'Route 53', desc: 'api.easyselect.kr' },
      { id: 'alb', lane: 'edge', kind: 'aws', title: 'ALB', desc: 'HTTPS 종단 (ACM)' },
      { id: 'cloudfront', lane: 'edge', kind: 'aws', title: 'CloudFront', desc: '파생본 CDN', status: 'planned' },
      { id: 'oauth', lane: 'edge', kind: 'ext', title: 'OAuth IdP', desc: '카카오 · 구글 · 네이버' },

      { id: 'app', lane: 'compute', kind: 'app', title: 'Spring Boot 모놀리스', desc: 'EC2 · 13개 도메인 · presigned 발급' },
      { id: 'embedder', lane: 'compute', kind: 'app', title: 'Lambda embedder', desc: 'DINOv2 · 파생본 · EXIF' },
      { id: 'stepfn', lane: 'compute', kind: 'aws', title: 'Step Functions + Batch', desc: 'AI 셀렉 워크플로', status: 'planned' },
      { id: 'sqs', lane: 'compute', kind: 'aws', title: 'SQS + DLQ', desc: '실패 재처리', status: 'planned' },

      { id: 's3', lane: 'data', kind: 'data', title: 'S3', desc: '원본 + 표시용 파생본' },
      { id: 'rds', lane: 'data', kind: 'data', title: 'RDS PostgreSQL', desc: 'pgvector · vector(768)' },
      { id: 'ssm', lane: 'data', kind: 'data', title: 'Parameter Store', desc: '설정 · 시크릿' },

      { id: 'loki', lane: 'obs', kind: 'obs', title: 'Loki', desc: '로그 (Alloy 사이드카)' },
      { id: 'grafana', lane: 'obs', kind: 'obs', title: 'Grafana', desc: '대시보드 · 알림', status: 'planned' }
    ],
    edges: [
      { from: 'visitor', to: 'vercel', kind: 'sync' },
      { from: 'photographer', to: 'vercel', kind: 'sync', label: '웹 UI' },
      { from: 'couple', to: 'vercel', kind: 'sync' },
      { from: 'guest', to: 'vercel', kind: 'sync' },
      { from: 'photographer', to: 'route53', kind: 'sync', label: 'API' },
      { from: 'couple', to: 'route53', kind: 'sync' },
      { from: 'guest', to: 'route53', kind: 'sync' },
      { from: 'route53', to: 'alb', kind: 'sync' },
      { from: 'alb', to: 'app', kind: 'sync', label: ':8080' },
      { from: 'app', to: 'oauth', kind: 'sync', label: '코드 교환' },
      { from: 'photographer', to: 's3', kind: 'data', label: 'presigned PUT — 원본 직접 업로드' },
      { from: 'couple', to: 's3', kind: 'data', label: 'presigned GET' },
      { from: 'guest', to: 's3', kind: 'data' },
      { from: 'app', to: 'embedder', kind: 'async', label: '갤러리 단위 EVENT 호출' },
      { from: 'embedder', to: 's3', kind: 'data', label: '원본 GET · 파생본 PUT' },
      { from: 'embedder', to: 'rds', kind: 'data', label: '임베딩 · EXIF 기록' },
      { from: 'app', to: 'rds', kind: 'data', label: 'JPA · 클러스터 조회' },
      { from: 'app', to: 'ssm', kind: 'data', label: '부팅 시 로드' },
      { from: 'app', to: 'loki', kind: 'async', label: '로그' },
      { from: 'couple', to: 'cloudfront', kind: 'sync', status: 'planned' },
      { from: 'cloudfront', to: 's3', kind: 'data', label: '파생본 캐시', status: 'planned' },
      { from: 'app', to: 'stepfn', kind: 'async', status: 'planned' },
      { from: 'stepfn', to: 'sqs', kind: 'async', status: 'planned' },
      { from: 'grafana', to: 'loki', kind: 'data', label: '조회', status: 'planned' }
    ]
  },

  infrastructure: {
    minWidth: 920,
    lanes: [
      { id: 'ext', title: '외부' },
      { id: 'region', title: 'AWS 리전 서비스' },
      { id: 'vpc', title: 'VPC (10.0.0.0/16 · 2 AZ)' }
    ],
    groups: [
      { id: 'pub', lane: 'vpc', title: 'Public Subnet' },
      { id: 'db', lane: 'vpc', title: 'DB Subnet — 인터넷 경로 없음' }
    ],
    nodes: [
      { id: 'browser', lane: 'ext', kind: 'client', title: '브라우저', desc: '작가 · 부부 · 게스트' },
      { id: 'gha', lane: 'ext', kind: 'ext', title: 'GitHub Actions', desc: 'main 머지 시 CD' },
      { id: 'ghcr', lane: 'ext', kind: 'ext', title: 'GHCR', desc: '앱 컨테이너 이미지' },

      { id: 'route53', lane: 'region', kind: 'aws', title: 'Route 53', desc: '별도 dns 스택으로 유지' },
      { id: 's3', lane: 'region', kind: 'data', title: 'S3 사진 버킷', desc: '원본 + previews/' },
      { id: 'ssm', lane: 'region', kind: 'aws', title: 'SSM', desc: 'Parameter Store · Run Command' },
      { id: 'iam', lane: 'region', kind: 'aws', title: 'IAM Role', desc: 'OIDC 신뢰 배포 롤' },
      { id: 'ecr', lane: 'region', kind: 'aws', title: 'ECR', desc: 'embedder 이미지' },

      { id: 'alb', lane: 'vpc', group: 'pub', kind: 'aws', title: 'ALB + ACM', desc: 'HTTPS' },
      { id: 'ec2', lane: 'vpc', group: 'pub', kind: 'app', title: 'EC2', desc: 'Spring Boot · docker compose' },
      { id: 'lambda', lane: 'vpc', group: 'db', kind: 'app', title: 'Lambda embedder', desc: 'DB 서브넷 연결' },
      { id: 'rds', lane: 'vpc', group: 'db', kind: 'data', title: 'RDS PostgreSQL', desc: 'Single-AZ · pgvector' },
      { id: 'vpce', lane: 'vpc', group: 'db', kind: 'aws', title: 'S3 게이트웨이 엔드포인트', desc: '과금 없는 S3 경로' }
    ],
    edges: [
      { from: 'browser', to: 'route53', kind: 'sync', label: 'api.easyselect.kr' },
      { from: 'route53', to: 'alb', kind: 'sync' },
      { from: 'alb', to: 'ec2', kind: 'sync', label: ':8080' },
      { from: 'ec2', to: 'rds', kind: 'sync', label: ':5432' },
      { from: 'browser', to: 's3', kind: 'data', label: 'presigned PUT/GET — 바이트 직접' },
      { from: 'ec2', to: 'ssm', kind: 'data', label: '부팅 시 설정' },
      { from: 'ec2', to: 'lambda', kind: 'async', label: '갤러리 단위 비동기 호출' },
      { from: 'lambda', to: 'vpce', kind: 'data' },
      { from: 'vpce', to: 's3', kind: 'data', label: '원본 GET · 파생본 PUT' },
      { from: 'lambda', to: 'rds', kind: 'data', label: '임베딩 기록' },
      { from: 'gha', to: 'iam', kind: 'deploy', label: 'OIDC 토큰 교환' },
      { from: 'gha', to: 'ssm', kind: 'deploy', label: 'Run Command' },
      { from: 'ssm', to: 'ec2', kind: 'deploy', label: '명령 실행' },
      { from: 'ec2', to: 'ghcr', kind: 'deploy', label: '이미지 pull' },
      { from: 'ecr', to: 'lambda', kind: 'deploy', label: '컨테이너 이미지' }
    ]
  }
};
