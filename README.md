# GOREON

<div align="center">
  <img width="200" height="200" alt="gormi" src="https://github.com/user-attachments/assets/9e5d6643-25b5-4d38-9162-ad0dcc568913" />
  <br/>
  <p><strong>나에게 맞는 전자기기를 더 빠르고 직관적으로 찾아주는 AI 쇼핑몰</strong></p>
  <p>
    프로젝트 기간 : 2026.03.30 ~ 2026.04.30
  </p>
  <p>
    <a href="https://goreon.onrender.com/" target="_blank">
      <img
        alt="서비스 바로가기"
          src="https://img.shields.io/badge/서비스%20바로가기-0AA6A6?style=for-the-badge&logo=render&logoColor=white"
      />
    </a>
  </p>
</div>

<br/>

## 주요 기능 & 화면

- 조건 기반 상품 검색 및 필터링
- 상품 비교 및 추천
- 직관적인 UI/UX
- 추후 AI 추천 기능 확장 예정

<br/>

## 팀원 소개

<table align="center">
  <tr>
    <td align="center" width="20%">
      <img src="https://github.com/muteLJS.png" width="100" style="border-radius:50%" /><br/>
      <strong><a href="https://github.com/muteLJS">muteLJS</a></strong><br/>
      <sub>Frontend</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/urusekai.png" width="100" style="border-radius:50%" /><br/>
      <strong><a href="https://github.com/urusekai">urusekai</a></strong><br/>
      <sub>Frontend</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/LeeSeungChans.png" width="100" style="border-radius:50%" /><br/>
      <strong><a href="https://github.com/LeeSeungChans">LeeSeungChans</a></strong><br/>
      <sub>Frontend</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/kAzee0700.png" width="100" style="border-radius:50%" /><br/>
      <strong><a href="https://github.com/kAzee0700">kAzee0700</a></strong><br/>
      <sub>Frontend</sub>
    </td>
    <td align="center" width="20%">
      <img src="https://github.com/gwonsumin.png" width="100" style="border-radius:50%" /><br/>
      <strong><a href="https://github.com/gwonsumin">gwonsumin</a></strong><br/>
      <sub>Frontend</sub>
    </td>
  </tr>
</table>

<br/>

## 기술 스택

<div align="center">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=000000" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFFFFF" />
  <img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=FFFFFF" />
  <img alt="React Router" src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=FFFFFF" />
  <img alt="Sass" src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=FFFFFF" />
  <br/>
  <img alt="Swiper" src="https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=FFFFFF" />
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=FFFFFF" />
  <img alt="Express" src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=FFFFFF" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=FFFFFF" />
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=FFFFFF" />
</div>

<br/>

## 폴더 구조

```bash
GOREON/
├─ frontend/                  # Vite + React 기반 프론트엔드
│  ├─ public/                 # 정적 파일
│  ├─ src/
│  │  ├─ assets/              # 이미지, 아이콘, 미디어 파일
│  │  ├─ components/          # 공통 UI 컴포넌트
│  │  ├─ pages/               # 라우트 단위 페이지
│  │  ├─ layouts/             # 레이아웃 컴포넌트
│  │  ├─ store/               # Redux store, slice
│  │  ├─ styles/              # 전역 스타일, 변수, 믹스인
│  │  ├─ utils/               # 유틸 함수 및 API 보조 로직
│  │  ├─ App.jsx              # 앱 라우팅 진입점
│  │  └─ main.jsx             # React 앱 마운트
│  └─ package.json
├─ backend/                   # Express + MongoDB 기반 백엔드
│  ├─ src/
│  │  ├─ config/              # DB 및 서버 설정
│  │  ├─ controllers/         # 요청 처리 로직
│  │  ├─ models/              # Mongoose 모델
│  │  ├─ routes/              # API 라우터
│  │  ├─ middleware/          # 인증, 에러 처리, 업로드 처리
│  │  ├─ utils/               # 백엔드 유틸 함수
│  │  ├─ app.js               # Express 앱 설정
│  │  └─ server.js            # 서버 실행 파일
│  └─ package.json
└─ README.md
```

<br/>

## 실행 방법
```bash
# frontend
cd frontend
npm install
npm run dev

# backend
cd backend
npm install
npm run dev
```
프론트엔드는 브라우저에서 `http://localhost:3000`으로 접속합니다.
