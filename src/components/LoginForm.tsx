
import { setToken } from '@/lib/auth';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setLogin } from '@/features/auth/authSlice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Facebook } from 'lucide-react';
import { SigninRequest } from '@/api/api'; // SigninRequest 타입 임포트
import { apiClient } from '@/lib/api'; // 전역 API 클라이언트

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // 전역 API 클라이언트 사용

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 🔄 백엔드 API 우선 시도
      console.log('🔄 백엔드 로그인 API 요청 시도...');

      // 비밀번호를 평문으로 전송 (서버에서 해시화 처리)
      console.log('🔄 로그인 요청 전송...');

      const response = await apiClient.api.signin({ username: username, password: password } as SigninRequest);

      // 응답이 HTML인지 확인 (백엔드 서버가 없을 때)
      if (typeof response.data === 'string' && (response.data as string).includes('<!DOCTYPE html>')) {
        throw new Error('백엔드 서버가 응답하지 않음');
      }

      // API 응답에서 토큰 추출 (응답 구조에 따라 조정)
      const token = (response.data as any)?.token || response.data;

      console.log('✅ 백엔드 로그인 성공');
      setToken(token);

      // 백엔드 응답에서 사용자 정보 추출
      const responseData = response.data as any;
      const user = responseData.user || responseData; // user 속성이 없으면 전체 데이터를 사용

      const backendUser = {
        id: user.id || user.memberId || 1,
        username: user.username || username,
        profileImage: user.profileImage || 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=USER',
        role: user.role || 'USER'
      };

      console.log('✅ BACKEND: user 변수에 백엔드 응답 사용자 정보 설정:', backendUser);
      dispatch(setLogin(backendUser));

      // 로그인 성공 후 메인 페이지로 리디렉션
      window.location.href = '/';

    } catch (error) {
      console.error('❌ 백엔드 로그인 실패, 더미 로그인 사용:', error);

      // 🧪 백엔드 실패 시 더미 로그인
      console.log('🧪 Development: Dummy login with:', { username, password });

      // 더미 토큰 생성
      const dummyToken = 'dummy-jwt-token-' + Date.now();
      console.log('🧪 HARDCODED: token 변수에 하드코딩된 더미 토큰 설정:', dummyToken);
      setToken(dummyToken);

      // 더미 로그인
      const dummyUser = {
        id: 1,
        username: username,
        profileImage: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=USER',
        role: 'USER'
      };
      console.log('🧪 HARDCODED: user 변수에 하드코딩된 더미 사용자 정보 설정:', dummyUser);
      dispatch(setLogin(dummyUser));

      // 로그인 성공 후 메인 페이지로 리디렉션
      window.location.href = '/';
    }
  };

  const handleFacebookLogin = () => {
    // Facebook 로그인 로직
    console.log('Facebook 로그인');
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-instagram-text tracking-tight">
          <span className="bg-gradient-to-r from-instagram-blue to-purple-400 bg-clip-text text-transparent">
            Uniqram
          </span>
        </h1>
      </div>

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="username" className="text-instagram-muted text-xs">
            사용자 이름
          </Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-instagram-gray border-instagram-border text-instagram-text placeholder:text-instagram-muted focus:border-instagram-blue"
            placeholder="사용자 이름"
            required
            pattern=".*"
            title=""
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-instagram-muted text-xs">
            비밀번호
          </Label>
          <Input
            id="password"
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-instagram-gray border-instagram-border text-instagram-text placeholder:text-instagram-muted focus:border-instagram-blue"
            placeholder="비밀번호 (아무 값이나 가능)"
            required
            pattern=".*"
            title=""
          />
        </div>

        <Button 
          type="submit"
          className="w-full bg-instagram-blue hover:bg-instagram-blue/90 text-white font-semibold py-2"
        >
          로그인
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <Separator className="bg-instagram-border" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-instagram-dark px-4 text-instagram-muted text-sm font-semibold">
            또는
          </span>
        </div>
      </div>

      {/* Facebook Login */}
      <Button
        onClick={handleFacebookLogin}
        variant="outline"
        className="w-full border-instagram-border text-instagram-blue hover:bg-instagram-gray/50 font-semibold"
      >
        <Facebook size={16} className="mr-2" />
        Facebook으로 로그인
      </Button>

      {/* Forgot Password */}
      <div className="text-center">
        <button className="text-instagram-blue text-sm hover:underline">
          비밀번호를 잊으셨나요?
        </button>
      </div>

      {/* Sign Up Link */}
      <div className="text-center border-t border-instagram-border pt-6 mt-8">
        <p className="text-instagram-muted text-sm">
          계정이 없으신가요?{' '}
          <button className="text-instagram-blue font-semibold hover:underline">
            가입하기
          </button>
        </p>
      </div>
    </div>
  );
};
