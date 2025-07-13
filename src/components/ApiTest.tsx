import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

const ApiTest = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const testApiConnection = async () => {
    setLoading(true);
    setError('');
    setStatus('');

    try {
      // 🔄 백엔드 API 우선 시도
      console.log('🔄 백엔드 API 요청 시도...');
      // 전역 API 클라이언트 사용
              const response = await apiClient.api.getRecommendedPosts();
      
      // 응답이 HTML인지 확인 (백엔드 서버가 없을 때)
      if (typeof response.data === 'string' && (response.data as string).includes('<!DOCTYPE html>')) {
        throw new Error('백엔드 서버가 응답하지 않음');
      }
      
      console.log('✅ 백엔드 API 성공:', response.data);
      setStatus(`✅ 백엔드 연결 성공! 게시물 ${Array.isArray(response.data) ? response.data.length : 0}개 로드됨`);
      
    } catch (err: any) {
      console.error('❌ 백엔드 API 실패, 더미 데이터 사용:', err);
      
      // 🧪 백엔드 실패 시 더미 데이터 사용
      const dummyPosts = [
        { postId: 1, content: '더미 게시물 1', username: 'user1' },
        { postId: 2, content: '더미 게시물 2', username: 'user2' },
        { postId: 3, content: '더미 게시물 3', username: 'user3' }
      ];
      
      console.log('🧪 HARDCODED: dummyPosts 변수에 하드코딩된 더미 게시물 데이터 설정:', dummyPosts);
      setStatus(`✅ 더미 데이터 성공! 게시물 ${dummyPosts.length}개 로드됨`);
      console.log('✅ 더미 API 테스트 성공:', dummyPosts);
      
      const errorMessage = err.response?.status 
        ? `❌ 백엔드 연결 실패 (${err.response.status}): ${err.response.data?.message || err.message}`
        : `❌ 백엔드 연결 실패: ${err.message}`;
      
      setError(errorMessage);
      
      if (err.code === 'ECONNABORTED') {
        setError('⏰ 타임아웃 - Spring 서버가 실행 중인지 확인하세요 (포트 8080)');
      } else if (err.code === 'ERR_NETWORK') {
        setError('🌐 네트워크 에러 - Spring 서버가 실행 중인지 확인하세요 (포트 8080)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-instagram-gray rounded-lg border border-instagram-border">
      <h3 className="text-lg font-semibold text-instagram-text mb-4">
        🔗 Spring 서버 연결 테스트
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={testApiConnection}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-instagram-border text-instagram-muted cursor-not-allowed'
              : 'bg-instagram-blue text-white hover:bg-blue-600'
          }`}
        >
          {loading ? '테스트 중...' : 'API 연결 테스트'}
        </button>

        {status && (
          <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm">{status}</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="text-xs text-instagram-muted space-y-1">
          <p>• React 서버: http://localhost:8081</p>
          <p>• Spring 서버: http://localhost:8080</p>
          <p>• API 프록시: /api → http://localhost:8080</p>
        </div>
      </div>
    </div>
  );
};

export default ApiTest; 