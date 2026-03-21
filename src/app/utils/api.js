import axios from "axios";

const url = import.meta.env.VITE_APP_SERVER_URL ; 
console.log(">>> debug ref .env  - " , url); 

const api = axios.create({
    baseURL : "http://localhost:8888",
    headers : {
        "Content-Type" : "application/json",
        "X-User-Id": 1
    }

});

// 로그인 기능 구현 시 사용
// api.interceptors.request.use(
//   (config) => {
//     // 요청을 보내기 직전에 localStorage에서 ID를 가져옵니다.
//     const userId = localStorage.getItem("userId");
    
//     if (userId) {
//       // 헤더에 X-User-Id를 동적으로 심어줍니다.
//       config.headers["X-User-Id"] = userId;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default api;