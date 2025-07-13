"use client";

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { SignupRequest } from '@/api/api';
import { apiClient } from '@/lib/api';

interface SignupForm {
    username: string;
    password: string;
    confirmPassword: string;
}

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    // 전역 API 클라이언트 사용
    
    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SignupForm>();

    const password = watch('password');
    const username = watch('username');
    const confirmPassword = watch('confirmPassword');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    // 실시간 제약조건 체크 함수들
    const checkUsernameConstraints = (value: string = '') => {
        return {
            minLength: value.length >= 2,
            maxLength: value.length <= 20,
            notEmpty: value.length > 0
        };
    };

    const checkPasswordConstraints = (value: string = '') => {
        return {
            minLength: value.length >= 6,
            maxLength: value.length <= 100,
            notEmpty: value.length > 0
        };
    };

    const checkPasswordMatch = () => {
        return password && confirmPassword && password === confirmPassword;
    };

    // 제약조건 표시 컴포넌트
    const ConstraintItem = ({ isValid, text }: { isValid: boolean; text: string }) => (
        <div className={`flex items-center gap-2 text-xs ${isValid ? 'text-green-600' : 'text-gray-500'}`}>
            <span className={`text-sm ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
                {isValid ? '✅' : '○'}
            </span>
            <span className={isValid ? 'font-medium' : ''}>{text}</span>
        </div>
    );

    const handleSignup = async (data: SignupForm) => {
        console.log('🚀 handleSignup 함수 시작:', data);
        
        try {
            if (data.password !== data.confirmPassword) {
                console.log('❌ 비밀번호 불일치');
                toast.error('비밀번호가 일치하지 않습니다.', {
                    id: 'password-mismatch',
                    duration: 3000,
                });
                return;
            }

            console.log('✅ 비밀번호 검증 통과');
            setIsLoading(true);

            // Swagger API 사용
            const signupData: SignupRequest = {
                username: data.username,
                password: data.password,
                confirmPassword: data.confirmPassword
            };

            console.log('📡 백엔드 API 호출 시작:', signupData);
            const response = await apiClient.api.signup(signupData);
            console.log('✅ 백엔드 API 호출 성공:', response);

            toast.success('회원가입이 완료되었습니다!', {
                id: 'signup-success',
                duration: 3000,
            });

            console.log('🔄 로그인 페이지로 이동');
            navigate('/login');

        } catch (error: any) {
            console.error('❌ 회원가입 오류 상세:', error);
            console.error('❌ 에러 응답:', error.response);
            console.error('❌ 에러 데이터:', error.response?.data);

            const errorMessage =
                error?.response?.data?.message || 
                error?.data?.message || 
                error?.message || 
                '회원가입에 실패했습니다.';

            console.log('💬 사용자에게 표시할 에러 메시지:', errorMessage);

            toast.error(errorMessage, {
                id: 'signup-error',
                duration: 3000,
            });
        } finally {
            console.log('🏁 handleSignup 함수 종료');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white border border-gray-300 p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-light mb-4 text-black" style={{ fontFamily: "cursive" }}>
                        Uniqram
                    </h1>
                    <p className="text-gray-600 text-sm font-medium">
                        친구들의 사진과 동영상을 보려면 가입하세요.
                    </p>
                </div>

                <form onSubmit={handleSubmit(
                    (data) => {
                        console.log('📝 React Hook Form handleSubmit 실행:', data);
                        handleSignup(data);
                    },
                    (errors) => {
                        console.error('❌ React Hook Form 검증 실패:', errors);
                    }
                )} className="space-y-3">
                    <div>
                        <Input
                            {...registerField('username', {
                                required: '사용자 ID를 입력해주세요',
                                minLength: {
                                    value: 2,
                                    message: '사용자 ID는 최소 2자 이상이어야 합니다'
                                },
                                maxLength: {
                                    value: 20,
                                    message: '사용자 ID는 최대 20자 이하여야 합니다'
                                }
                            })}
                            type="text"
                            placeholder="사용자 ID"
                            className="w-full px-2 py-2 text-xs text-black bg-gray-50 border border-gray-300 rounded-sm focus:border-gray-400 focus:bg-white"
                        />
                        
                        {/* 사용자 ID 제약조건 체크리스트 */}
                        {username && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-sm border">
                                <div className="space-y-1">
                                    <ConstraintItem 
                                        isValid={checkUsernameConstraints(username).minLength} 
                                        text="최소 2자 이상" 
                                    />
                                    <ConstraintItem 
                                        isValid={checkUsernameConstraints(username).maxLength} 
                                        text="최대 20자 이하" 
                                    />
                                </div>
                            </div>
                        )}
                        
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <Input
                                {...registerField('password', {
                                    required: '비밀번호를 입력해주세요',
                                    minLength: {
                                        value: 6,
                                        message: '비밀번호는 최소 6자 이상이어야 합니다',
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: '비밀번호는 최대 100자 이하여야 합니다'
                                    }
                                })}
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
                        </div>
                        
                        {/* 비밀번호 제약조건 체크리스트 */}
                        {password && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-sm border">
                                <div className="space-y-1">
                                    <ConstraintItem 
                                        isValid={checkPasswordConstraints(password).minLength} 
                                        text="최소 6자 이상" 
                                    />
                                    <ConstraintItem 
                                        isValid={checkPasswordConstraints(password).maxLength} 
                                        text="최대 100자 이하" 
                                    />
                                </div>
                            </div>
                        )}
                        
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            {...registerField('confirmPassword', {
                                required: '비밀번호 확인을 입력해주세요',
                                validate: value => value === password || '비밀번호가 일치하지 않습니다',
                            })}
                            type="password"
                            placeholder="비밀번호 확인"
                            className="w-full px-2 py-2 text-xs text-black bg-gray-50 border border-gray-300 rounded-sm focus:border-gray-400 focus:bg-white"
                        />
                        
                        {/* 비밀번호 확인 체크 */}
                        {confirmPassword && (
                            <div className="mt-2 p-2 bg-gray-50 rounded-sm border">
                                <ConstraintItem 
                                    isValid={checkPasswordMatch()} 
                                    text="비밀번호가 일치함" 
                                />
                            </div>
                        )}
                        
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 text-sm rounded-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? '가입 중...' : '가입'}
                        </Button>
                        <p className="text-center text-sm mt-4 text-black">
                            계정이 있으신가요?{" "}
                            <Link to="/login" className="text-blue-900 font-medium">
                                로그인
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
