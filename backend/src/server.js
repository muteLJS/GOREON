/* -------------------------------------------------------------------------- */
/* [서버] 백엔드 서버 진입점 (server)                                          */
/* 설명: 환경 변수를 읽고 서버를 실행하는 백엔드 시작 파일입니다.             */
/* -------------------------------------------------------------------------- */

const { createApp } = require("./app");

const PORT = process.env.PORT || 8080;
const app = createApp();

console.log(`Backend placeholder running on port ${PORT}`);
console.log(app.message);
