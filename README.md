# CloudBridge Platform

CloudBridge Platform은 여러 FastAPI 애플리케이션과 공유 모델로 구성된 마이크로서비스 기반 시스템입니다.

## 프로젝트 구조

```bash
cloudbridge-platform/
├── apps/
│   ├── platform-main/    # 메인 API (FastAPI) - 포트 4000
│   ├── platform-menu/    # 메뉴 API (FastAPI) - 포트 4100
│   ├── frontend/         # Frontend application
│   └── backend/          # Backend services
├── shared/
│   └── models/          # 공유 Pydantic 모델
├── devops/
│   ├── ingress/         # Nginx Ingress 설정
│   └── helm/            # 배포용 Helm 차트
├── scripts/             # 유틸리티 스크립트
├── config/              # 설정 파일
└── .ci_error/           # 오류 로그 (자동 생성)
```

## 애플리케이션

### 플랫폼 메인 API (포트 4000)

OAuth 지원(Google, Naver)이 포함된 CloudBridge 플랫폼용 메인 API입니다.

### 플랫폼 메뉴 API (포트 4100)

CloudBridge 플랫폼용 메뉴 API입니다.

## 공유 모델

- **User**: 인증을 지원하는 사용자 모델
- **Store**: 상점/비즈니스 모델
- **Feed**: 콘텐츠 피드 모델

## DevOps

### Ingress 설정

Nginx Ingress는 다음과 같이 라우팅됩니다:

- `/api/main/*` → 플랫폼 메인 API (4000)
- `/api/menu/*` → 플랫폼 메뉴 API (4100)

### Helm 차트

Kubernetes 배포를 위한 두 애플리케이션에 대한 Helm 차트가 제공됩니다.

## 개발 정책

### 역할 할당

- **Cursor**: 시공 인턴 - 스캐폴딩, 보일러플레이트 생성
- **GPT-O3**: 감독 - 코드 리뷰, 버그 탐지, 보안 점검
- **Claude**: 시니어 - 성능 리팩터링, 가독성 개선
- **Human**: 오너 - 핵심 비즈니스 로직, 배포, 보안 최종 승인

### 기술 정책

- 자동 저장: 비활성화 (AUTOSAVE=off)
- 포트 잠금: 4000, 4100, 4200 (PORT_LOCK=4000,4100,4200)
- 패키지 자동 업데이트: 비활성화 (NO_PACKAGE_UPDATE=true)
- 최대 파일 생성 제한: 20개 (MAX_FILES_PER_RUN=20)
- 변경사항 미리보기: 필수
- 자동 커밋 접두어: "[AUTO] "
- 파일 생성 제한 경로: `apps/`, `helm/`, `scripts/`

### 에러 처리

- 오류 발생 시 자동 일시 중지 (PAUSE=true)
- 오류 발생 시 실행 명령어: 로그 기록 및 알림
- 롤백 명령어: 마지막 안정 상태로 복구
- 오류 로그 기록 및 보고

### 체크포인트

다음 단계 이후에 개발 체크포인트가 시행됩니다:

- 초기화
- 인증 설정
- 인그레스 설정
- Helm 차트 수정

체크포인트 실행 방법:

```bash
# Windows
.\scripts\run_checkpoint.ps1 <checkpoint_name>

# Linux/Mac
./scripts/run_checkpoint.sh <checkpoint_name>
```

## 플랫폼 설정 스크립트

전체 플랫폼 설정을 자동화하는 스크립트:

```bash
# Windows
.\scripts\setup_platform.ps1

# Linux/Mac
./scripts/setup_platform.sh
```

## 설정 검증

플랫폼 설정 유효성 검증:

```bash
# Windows
.\scripts\validate_setup.ps1
```
