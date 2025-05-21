# GitHub Flow 가이드

CloudBridge 메뉴 프론트엔드 프로젝트에서 GitHub Flow를 활용한 협업 과정을 안내합니다.

## GitHub Flow 란?

GitHub Flow는 간단하고 효율적인 브랜치 기반 워크플로우입니다. 주요 특징:

- `main` 브랜치는 항상 배포 가능한 상태를 유지합니다.
- 새로운 작업은 브랜치를 만들어 진행합니다.
- 로컬에서 커밋하고 원격 저장소에 정기적으로 푸시합니다.
- Pull Request를 통해 코드 리뷰를 진행합니다.
- 승인 후 `main` 브랜치에 병합합니다.

## 1. 브랜치 생성

새로운 기능 개발이나 버그 수정을 시작할 때는 항상 새 브랜치를 생성합니다:

```bash
# main 브랜치에서 최신 코드 가져오기
git checkout main
git pull origin main

# 새 브랜치 생성 및 전환
git checkout -b feature/명확한-기능-이름
# 또는
git checkout -b bugfix/명확한-버그-설명
```

## 2. 작업 및 커밋

로컬에서 변경 작업을 하고 의미 있는 단위로 커밋합니다:

```bash
# 파일 변경 후
git add 변경된_파일.tsx
git commit -m "명확한 커밋 메시지: 무엇을 왜 변경했는지 설명"
```

좋은 커밋 메시지 작성법:

- 첫 줄은 변경 내용을 간결하게 요약 (50자 이내)
- 필요하면 빈 줄 이후에 상세 설명 추가
- 현재 시제 사용 ("Fix bug" / "Add feature" 등)

## 3. 원격 저장소에 푸시

작업 내용을 정기적으로 원격 저장소에 푸시합니다:

```bash
git push -u origin 브랜치이름
```

첫 푸시 이후에는 단순히:

```bash
git push
```

## 4. Pull Request 생성

GitHub 웹 인터페이스를 통해 Pull Request(PR)를 생성합니다:

1. GitHub 저장소 페이지 방문
2. `Pull requests` 탭 클릭
3. `New pull request` 버튼 클릭
4. 베이스 브랜치(`main`)와 비교 브랜치(작업 브랜치) 선택
5. `Create pull request` 클릭
6. PR 제목과 설명 작성
7. `Create pull request` 클릭하여 최종 생성

PR 작성 시 포함할 내용:

- 변경 사항에 대한 명확한 설명
- 관련 이슈 번호 (있는 경우)
- 테스트 방법
- 스크린샷 (UI 변경 시)

## 5. 코드 리뷰

다른 팀원들이 PR을 리뷰하고 피드백을 제공합니다:

- 코드 퀄리티, 버그, 개선 사항 등을 체크
- 피드백에 따라 추가 수정 작업 진행
- 수정 후 동일 브랜치에 추가 커밋 및 푸시
- 모든 리뷰가 승인되면 다음 단계로 진행

## 6. 병합 (Merge)

모든 검토가 완료되면 PR을 `main` 브랜치에 병합합니다:

1. PR 페이지에서 `Merge pull request` 버튼 클릭
2. 병합 방식 선택 (일반적으로 "Squash and merge" 권장)
3. 확인 버튼 클릭

## 7. 브랜치 정리

병합 완료 후 로컬 브랜치를 정리합니다:

```bash
# main 브랜치로 전환
git checkout main

# 최신 변경사항 가져오기
git pull origin main

# 작업 완료된 로컬 브랜치 삭제
git branch -d 브랜치이름
```

## 자동화된 워크플로우

이 프로젝트에는 다음과 같은 GitHub Actions 워크플로우가 구성되어 있습니다:

1. **CI (Continuous Integration)**
   - 코드 품질 검사 (린트, 타입 체크)
   - 테스트 실행
   - 빌드 검증

2. **CD (Continuous Deployment)**
   - main 브랜치 병합 시 자동 배포
   - 배포 환경별 설정 (개발, 스테이징, 프로덕션)

## 이슈 관리

효율적인 작업 관리를 위해 GitHub Issues를 활용합니다:

1. 새로운 기능, 버그, 개선 사항은 Issues로 등록
2. 적절한 라벨 부여 (bug, enhancement, documentation 등)
3. 담당자 지정
4. 마일스톤 연결 (필요시)
5. 작업 시작 전 Issue 번호로 브랜치 생성 (예: `feature/123-새기능`)
6. PR에서 "Closes #이슈번호" 형식으로 이슈 연결

## 충돌 해결

병합 충돌이 발생했을 때 해결 방법:

```bash
# 최신 main 브랜치 가져오기
git checkout main
git pull origin main

# 작업 브랜치로 전환
git checkout 작업브랜치

# main의 변경사항을 작업 브랜치에 병합 (충돌 발생)
git merge main

# 충돌 파일 수정 후
git add 충돌해결한파일들
git commit -m "충돌 해결: 간략한 설명"
git push
```

## 자주 발생하는 문제 해결

1. **푸시 거부 (non-fast-forward)**

   ```bash
   git pull --rebase origin 브랜치이름
   git push
   ```

2. **실수로 main에 직접 커밋한 경우**

   ```bash
   git branch 임시브랜치
   git reset --hard origin/main
   git checkout 임시브랜치
   ```

3. **커밋 메시지 수정**

   ```bash
   git commit --amend -m "새로운 커밋 메시지"
   git push --force-with-lease  # 주의: 공유 브랜치에서는 사용 자제
   ```
