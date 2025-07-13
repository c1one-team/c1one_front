import React, { useState } from 'react';
import { useLoginMutation } from '@/lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { removeToken } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { setLogin, clearUser } from '@/features/auth/authSlice';

interface LoginForm {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loginMutation, { isLoading }] = useLoginMutation();

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const onSubmit = async (data: LoginForm) => {
        try {
            // 🗑️ 로그인 시작 전에 기존 인증 정보 제거 (새로운 토큰을 받기 위해)
            console.log('🗑️ 기존 토큰 및 사용자 정보 제거 중...');
            removeToken(); // localStorage에서 기존 토큰 제거
            localStorage.removeItem('currentUsername'); // localStorage에서 기존 currentUsername 제거
            localStorage.removeItem('userInfo'); // localStorage에서 기존 사용자 정보 제거
            dispatch(clearUser()); // Redux에서 기존 사용자 정보 제거

            // Redux Toolkit Query 사용
            const signinData = {
                username: data.username,
                password: data.password
            };

            console.log('🔄 로그인 요청 데이터:', signinData);

            const responseData = await loginMutation(signinData).unwrap() as any;

            console.log('📥 로그인 응답 전체:', responseData);
            console.log('📥 응답 타입:', typeof responseData);
            console.log('📥 응답 객체 키들:', Object.keys(responseData));

            // 응답 데이터 확인
            if (responseData && responseData.user) {
                const user = responseData.user;
                
                console.log('🍪 HTTP-only 쿠키로 토큰 설정됨 (withCredentials: true로 자동 포함)');
                console.log('🚫 accessToken, refreshToken 무시 (HTTP-only cookie 사용)');

                // Redux 상태 업데이트
                const userInfo = {
                    id: user.id,
                    username: user.username,
                    role: user.role || 'USER',
                    ...user
                };
                
                dispatch(setLogin(userInfo));
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                console.log('✅ Redux에 저장된 사용자 정보:', userInfo);

                toast.success('로그인에 성공했습니다!', {
                    id: 'login-success',
                    duration: 3000,
                });

                navigate('/');

            } else {
                console.error('❌ user 정보가 응답에 없습니다:', responseData);
                toast.error('서버 응답에 사용자 정보가 없습니다.', {
                    id: 'login-error',
                    duration: 3000,
                });
            }

        } catch (error: any) {
        console.error('🚫 로그인 오류:', error);

        const status = error?.response?.status;
        const failureMessage = error?.response?.data?.message;

        if (status === 401) {
            console.log('🚫 401 로그인 실패 메시지:', failureMessage);
            toast.error(failureMessage || '로그인에 실패했습니다.', {
                id: 'login-error',
                duration: 3000,
            });
        }

        // ✅ 정지된 계정 응답 처리 (403 Forbidden)
        else if (status === 403) {
            console.log('🚫 403 Forbidden - 블랙리스트:', failureMessage);
            toast.error('🚫 해당 계정은 관리자에 의해 정지되었습니다.', {
                id: 'blacklist-error',
                duration: 3000,
            });
        }

        // ✅ 그 외의 에러 처리
        else {
            const errorMessage =
                failureMessage ||
                error?.data?.message ||
                error?.message ||
                '로그인에 실패했습니다.';

            toast.error(errorMessage, {
                id: 'login-error',
                duration: 3000,
            });
        }
    } finally {
            console.log('🏁 로그인 함수 종료');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border border-gray-300 p-8">
                {/* 타이틀 */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light mb-4 text-black" style={{ fontFamily: 'cursive' }}>
                        Uniqram
                    </h1>
                    <p className="text-gray-600 text-sm font-medium">
                        계정에 로그인하세요
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                    <input
                        {...register('username', { required: '사용자 이름을 입력해주세요' })}
                        type="text"
                        placeholder="사용자 이름"
                        className="w-full px-2 py-2 text-xs text-black bg-gray-50 border border-gray-300 rounded-sm focus:border-gray-400 focus:bg-white"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                    )}

                    <div className="relative">
                        <input
                            {...register('password', { required: '비밀번호를 입력해주세요' })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="비밀번호"
                            className="w-full pr-10 px-2 py-2 text-xs text-black bg-gray-50 border border-gray-300 rounded-sm focus:border-gray-400 focus:bg-white"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 text-sm rounded-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </Button>
                        <p className="text-center text-sm mt-4 text-black">
                            계정이 없으신가요?{' '}
                            <Link to="/signup" className="text-blue-900 font-medium">
                                회원가입
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;