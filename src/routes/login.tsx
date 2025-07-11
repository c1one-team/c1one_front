import React, { useState } from 'react';
import { Api, SigninRequest } from '@/api/api';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { setToken } from '@/lib/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/auth/authSlice';

interface LoginForm {
    username: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    // API 클라이언트 인스턴스 생성
    const apiClient = new Api();
    

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    const onSubmit = async (data: LoginForm) => {
        try {
            setIsLoading(true);
            
            // Swagger API 사용
            const signinData: SigninRequest = {
                username: data.username,
                password: data.password
            };


            console.log('🔄 로그인 요청 데이터:', signinData);
            
            const response = await apiClient.api.signin(signinData);
            
            console.log('📥 로그인 응답 전체:', response);
            console.log('📥 응답 상태:', response.status);
            
            // 200 OK 응답 확인
            if (response.status === 200 && response.data) {
                const responseData = response.data as any;
                
                // 1. message를 console에 출력
                if (responseData.message) {
                    console.log('📧 백엔드 메시지:', responseData.message);
                }
                
                // 2. accessToken을 JWT 토큰으로 설정
                if (responseData.accessToken) {
                    setToken(responseData.accessToken);
                    console.log('✅ JWT 토큰 저장 완료');
                    
                    // 🔒 HTTP Only 쿠키 설정 안내
                    // 주의: HTTP Only 쿠키는 JavaScript로 설정할 수 없습니다.
                    // 백엔드에서 Set-Cookie 헤더로 설정해야 합니다.
                    // 현재는 localStorage에 저장하지만, 보안을 위해서는
                    // 백엔드에서 HTTP Only 쿠키로 토큰을 설정하는 것이 좋습니다.
                    console.log('⚠️  보안 권장사항: HTTP Only 쿠키는 백엔드에서 Set-Cookie로 설정해야 합니다');
                    
                    // Redux 상태 업데이트
                    dispatch(setUser({
                        id: 1, // TODO: 실제 사용자 ID는 백엔드 응답에서 가져오기
                        username: data.username,
                        email: `${data.username}@example.com`, // TODO: 실제 이메일은 백엔드 응답에서 가져오기
                        profileImage: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=USER'
                    }));
                    console.log('✅ Redux 상태 업데이트 완료');
                    
                    // 3. redirectUrl 무시하고 index.tsx로 리다이렉트
                    console.log('🚫 redirectUrl 무시:', responseData.redirectUrl);
                    
                    toast.success('로그인에 성공했습니다!', {
                        id: 'login-success',
                        duration: 3000,
                    });
                    
                    // index.tsx로 리다이렉트 (/ 경로)
                    navigate('/');
                    
                } else {
                    console.error('❌ accessToken이 응답에 없습니다:', responseData);
                    toast.error('서버 응답에 토큰이 없습니다.', {
                        id: 'login-error',
                        duration: 3000,
                    });
                }
            } else {
                console.error('❌ 응답 상태가 200이 아닙니다:', response.status);
                toast.error('로그인 처리 중 오류가 발생했습니다.', {
                    id: 'login-error',
                    duration: 3000,
                });
            }
            
        } catch (error: any) {
            console.error('🚫 로그인 오류:', error);
            
            // 401 Unauthorized 에러 처리
            if (error?.response?.status === 401) {
                const failureMessage = error?.response?.data?.message;
                console.log('🚫 401 로그인 실패 메시지:', failureMessage);
                
                // 기존 로그인 실패 메시지 처리 로직 사용
                toast.error(failureMessage || '로그인에 실패했습니다.', {
                    id: 'login-error',
                    duration: 3000,
                });
            } else {
                // 기타 에러 처리
                const errorMessage = 
                    error?.response?.data?.message || 
                    error?.data?.message || 
                    error?.message || 
                    '로그인에 실패했습니다.';
                    
                toast.error(errorMessage, {
                    id: 'login-error',
                    duration: 3000,
                });
            }
        } finally {
            setIsLoading(false);

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
