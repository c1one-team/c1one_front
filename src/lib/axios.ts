import axios from 'axios';
import { toast } from 'sonner'; // 알림 메시지용
import { store } from '@/app/store'; // Redux 스토어
import { clearUser } from '@/features/auth/authSlice'; // 사용자 초기화

// axios 인스턴스 생성
const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 API 요청에 토큰 포함됨');
        } else {
            console.log('⚠️ 토큰이 없어서 API 요청에 Authorization 헤더 없음');
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;

        if (status === 401 || status === 403) {
            // 👉 블랙리스트 또는 인증 만료 시 공통 처리
            console.log('🚫 자동 로그아웃 처리 - 상태코드:', status);

            localStorage.removeItem('jwt_token');
            store.dispatch(clearUser()); // Redux 상태 초기화

            // 사용자에게 알림
            toast.error(
                status === 403
                    ? '🚫 해당 계정은 정지되었습니다.'
                    : '⏱️ 세션이 만료되었습니다. 다시 로그인해주세요.',
                {
                    duration: 4000,
                    id: 'auto-logout',
                }
            );

            // 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
        return Promise.reject(error);
    }
);

export default api;
