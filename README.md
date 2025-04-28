# Cloudbridge Menu Frontend

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
