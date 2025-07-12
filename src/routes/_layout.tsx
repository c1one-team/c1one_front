// ========================================
// 🏗️ _layout.tsx - 모든 페이지의 공통 레이아웃
// ========================================
// 이 파일은 모든 페이지에서 공통으로 사용되는 레이아웃을 정의합니다.
// 사이드바, 헤더, 푸터 등이 여기에 들어갈 수 있습니다.

// 📦 필요한 컴포넌트들을 가져오기
import { Outlet } from 'react-router-dom'; // 하위 페이지를 표시할 자리
import { Sidebar } from '@/components/Sidebar';
import AuthWrapper from '@/components/AuthWrapper';

const Layout = () => {
  return (
    <AuthWrapper>
      <div className="flex h-screen bg-black">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </AuthWrapper>
  );
};

export default Layout;