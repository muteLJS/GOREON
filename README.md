# GOREON

AI 기반 전자기기 쇼핑 및 추천 서비스 프로젝트입니다.

## 프로젝트 개요

GOREON은 사용자의 예산, 성능, 용도에 맞는 전자기기를 더 쉽게 탐색하고 비교할 수 있도록 돕는 서비스를 목표로 합니다.

- 조건 기반 상품 검색 및 필터링
- 상품 비교 및 추천
- 직관적인 UI/UX
- 추후 AI 추천 기능 확장 예정

## 폴더 구조

```bash
GOREON/
├─ frontend/
│  ├─ public/
│  ├─ src/
│  │  ├─ assets/
│  │  ├─ components/
│  │  ├─ pages/
│  │  ├─ layouts/
│  │  ├─ styles/
│  │  ├─ store/
│  │  ├─ api/
│  │  ├─ utils/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.scss
│  ├─ .env
│  ├─ jsconfig.json
│  ├─ package.json
│  └─ package-lock.json
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js
│  │  ├─ controllers/
│  │  │  ├─ productController.js
│  │  │  ├─ userController.js
│  │  │  ├─ cartController.js
│  │  │  └─ reviewController.js
│  │  ├─ models/
│  │  │  ├─ Product.js
│  │  │  ├─ User.js
│  │  │  ├─ Cart.js
│  │  │  └─ Review.js
│  │  ├─ routes/
│  │  │  ├─ productRoutes.js
│  │  │  ├─ userRoutes.js
│  │  │  ├─ cartRoutes.js
│  │  │  └─ reviewRoutes.js
│  │  ├─ middleware/
│  │  │  ├─ auth.js
│  │  │  ├─ errorHandler.js
│  │  │  └─ upload.js
│  │  ├─ utils/
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ uploads/
│  ├─ .env
│  └─ package.json
├─ .gitignore
└─ README.md
```

## 환경 변수 관리

환경 변수는 서비스별로 분리합니다.

- `frontend/.env`
- `backend/.env`

주의사항:
- 프론트엔드에는 공개 가능한 값만 둡니다.
- 비밀키, DB 연결 정보, 토큰 시크릿은 `backend/.env`에만 둡니다.
- `.gitignore`는 루트에서 통합 관리합니다.

## 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 백엔드 실행

현재는 기본 골격만 생성된 상태입니다.

```bash
cd backend
npm install
npm run dev
```

## 협업 환경

프론트엔드 작업 전 아래 두 VS Code 확장을 설치하는 것을 권장합니다.

- `Prettier - Code formatter`
- `ESLint`

프론트엔드 공통 작업 명령:

```bash
cd frontend
npm run lint
npm run format
```

협업 기준:
- 저장 시 자동 포맷이 적용됩니다.
- 탭 크기는 2칸입니다.
- alias import는 `jsconfig.json`과 `vite.config.js` 기준으로 사용합니다.

예시:

```jsx
import Header from "components/pc/Header/Header";
import Logo from "assets/img/logo/logo.svg";
import store from "store/store";
```

## 권장 실행 환경

- Node.js 18 이상
- npm 9 이상
