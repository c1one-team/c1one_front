export interface AuthUser {
    userId: number;
    username?: string;
  }
  
  export function useAuth(): AuthUser | null {
    const token = localStorage.getItem('jwt_token');
    console.log('🌟 [useAuth] raw token:', token);
    if (!token) return null;
  
    try {
      const payloadPart = token.split('.')[1];
      const decoded = atob(payloadPart.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(decoded);
  
      console.log('🌟 [useAuth] decoded payload:', payload);
  
      return {
        userId: payload.userId,   // ✅ 여기!
        username: payload.sub,    // ✅ sub에서 username 대신 가져오기
      };
    } catch (error) {
      console.error('❌ Failed to parse JWT token:', error);
      return null;
    }
  }
  