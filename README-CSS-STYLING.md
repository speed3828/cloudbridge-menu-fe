# CloudBridge 메뉴 프론트엔드 - CSS 클래스 기반 스타일링

이 저장소는 CloudBridge 메뉴 프론트엔드 프로젝트에서 인라인 스타일을 CSS 클래스 기반 스타일링으로 개선하는 작업을 담고 있습니다.

## 🌟 주요 특징

- 인라인 스타일 제거 및 CSS 모듈 기반 스타일링 적용
- 다양한 메뉴 컴포넌트 구현 및 개선
- 반응형 그리드 및 리스트 뷰 지원
- 메뉴 필터링 기능 구현

## 📋 구현 컴포넌트

### 1. VirtualizedMenuGrid3

- `@tanstack/react-virtual` 라이브러리를 사용한 가상화 그리드
- 인라인 스타일 대신 CSS 클래스 기반 동적 스타일링
- 미리 정의된 클래스를 활용한 성능 최적화

### 2. MenuListAdvanced

- CSS 모듈을 활용한 스타일링
- 그리드 및 리스트 레이아웃 전환 지원
- 태그, 할인, 상태(인기/추천) 표시 기능

### 3. MenuFilter

- 카테고리, 태그, 가격 범위 등 다양한 필터링 옵션 제공
- CSS 클래스를 활용한 필터 상태 시각화
- 사용자 친화적인 필터 UI 구현

## 🚀 페이지 구성

1. **V3 그리드 페이지** (`/menu/v3`)
   - VirtualizedMenuGrid3 컴포넌트를 활용한 가상화 그리드 메뉴 표시

2. **고급 메뉴 페이지** (`/menu/advanced`)
   - MenuListAdvanced 컴포넌트를 활용한 그리드/리스트 전환 가능한 메뉴 표시

3. **필터 메뉴 페이지** (`/menu/filter`)
   - MenuFilter와 MenuListAdvanced 컴포넌트를 결합한 필터링 가능한 메뉴 페이지

## 💻 기술 스택

- React & Next.js
- TypeScript
- CSS Modules
- TanStack Virtual (@tanstack/react-virtual)
- TailwindCSS

## 📚 CSS 클래스 기반 스타일링 가이드

### 장점

1. **성능 최적화**: 인라인 스타일에 비해 렌더링 성능 향상
2. **재사용성**: 동일한 스타일을 여러 요소에 적용 가능
3. **유지보수성**: 스타일 변경 시 한 곳에서 관리 가능
4. **코드 가독성**: JSX 코드에서 스타일 로직 분리로 가독성 향상
5. **조건부 스타일링**: 클래스 조합을 통한 쉬운 조건부 스타일링

### 구현 방법

1. **CSS 모듈 생성**:

   ```tsx
   // 파일명: Component.module.css
   .container { ... }
   .active { ... }
   ```

2. **컴포넌트에서 가져오기**:

   ```tsx
   import styles from './Component.module.css';
   ```

3. **조건부 클래스 적용**:

   ```tsx
   <div className={`${styles.container} ${isActive ? styles.active : ''}`}>
   ```

4. **미리 정의된 클래스 활용**:
   많은 동적 값을 처리할 때는 미리 정의된 클래스 세트를 만들고,
   가장 가까운 값의 클래스를 선택하는 유틸리티 함수를 활용합니다.

## 🔄 GitHub 활용 방법

1. **브랜치 관리**
   - `main`: 안정화된 코드
   - `css-class-styling`: CSS 클래스 기반 스타일링 개선 작업

2. **Pull Request 과정**
   - 개발 완료 후 `css-class-styling` 브랜치에서 `main`으로 Pull Request 생성
   - 코드 리뷰 후 승인 및 병합

## 🛠 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/사용자이름/cloudbridge-menu-fe.git
cd cloudbridge-menu-fe

# 브랜치 전환
git checkout css-class-styling

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 📝 라이센스

이 프로젝트는 MIT 라이센스를 따릅니다.
