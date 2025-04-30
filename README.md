# Cloudbridge Menu Frontend

Interactive menu platform powered by Cloudbridge.

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- React Query
- PWA

## 주요 기능

- 반응형 메뉴 인터페이스
- 실시간 데이터 업데이트
- PWA 지원
- 다국어 지원

## 보안 기능

- CSRF 보호
- Rate Limiting
- JWT 토큰 관리
- XSS 방지

## 성능 최적화

- 이미지 최적화
- 코드 스플리팅
- 캐싱 전략
- 성능 모니터링

## 테스트

- Jest
- React Testing Library
- E2E 테스트

## 환경 설정

프로젝트를 실행하기 전에 다음 환경 변수를 설정해야 합니다:

### 필수 환경 변수

- `NEXT_PUBLIC_API_URL`: API 서버 URL (예: http://localhost:3000)
- `API_TIMEOUT`: API 요청 타임아웃 (밀리초, 기본값: 10000)
- `COOKIE_DOMAIN`: 쿠키 도메인 (예: .autoriseinsight.co.kr)
- `JWT_SECRET`: JWT 시크릿 키

### 선택적 환경 변수

- `NODE_ENV`: 실행 환경 (development/production)
- `NEXT_PUBLIC_PWA_NAME`: PWA 이름
- `NEXT_PUBLIC_PWA_SHORT_NAME`: PWA 짧은 이름
- `NEXT_PUBLIC_PWA_DESCRIPTION`: PWA 설명

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 테스트 실행
npm test

# 테스트 커버리지 확인
npm run test:coverage
```

## 프로젝트 구조

```
src/
├── app/              # Next.js 앱 라우터
├── components/       # React 컴포넌트
│   ├── ui/          # 공통 UI 컴포넌트
│   └── __tests__/   # 컴포넌트 테스트
├── config/          # 설정 파일
├── contexts/        # React 컨텍스트
├── hooks/           # 커스텀 훅
│   └── __tests__/   # 훅 테스트
├── lib/             # 유틸리티 함수
├── middleware/      # 미들웨어
└── types/           # TypeScript 타입 정의
```

## 라이선스

MIT

## Project Structure

```plaintext
.
├── apps/
│   ├── frontend/     # Frontend application
│   └── backend/      # Backend services
├── helm/
│   └── charts/       # Kubernetes Helm charts
└── scripts/
    └── setup/        # Setup and configuration scripts
```

## Development Policies

### Role Assignments (setup:role)

- **CURSOR**: 시공 인턴 - 스캐폴딩, 보일러플레이트 생성
- **GPT_O3**: 감독 - 코드 리뷰, 버그 탐지, 보안 점검
- **CLAUDE**: 시니어 - 성능 리팩터링, 가독성 개선
- **HUMAN**: 오너 - 핵심 비즈니스 로직, 배포, 보안 최종 승인

### Technical Policies (setup:policy)

- 자동 저장: 비활성화 (AUTOSAVE=off)
- 포트 잠금: 4200 (PORT_LOCK=4200)
- 패키지 자동 업데이트: 비활성화 (NO_PACKAGE_UPDATE=true)
- 최대 파일 생성 제한: 20개 (MAX_FILES_PER_RUN=20)
- 변경사항 미리보기: 필수
- 자동 커밋 접두어: "[AUTO] "
- 파일 생성 제한 경로: `apps/`, `helm/`, `scripts/`

### Error Handling (setup:on_error)

- 오류 발생 시 자동 일시 중지 (PAUSE=true)
- 오류 발생 시 실행 명령어: 로그 기록 및 알림
- 롤백 명령어: 마지막 안정 상태로 복구
- 오류 로그 기록 및 보고

### Checkpoints

- 초기화
- 인증 설정
- 인그레스 설정
- Helm 차트 수정
