import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import Pages from "vite-plugin-pages";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_'); // ⬅️ 환경 변수 로드 (VITE_ 접두사 지정)
  
  // 디버깅: 환경변수 로드 상태 확인
  console.log('🔍 환경변수 로드 상태:');
  console.log('현재 디렉토리:', process.cwd());
  console.log('모드:', mode);
  console.log('VITE_API_BASE_URL:', env.VITE_API_BASE_URL);
  console.log('VITE_WS_BASE_URL:', env.VITE_WS_BASE_URL);
  console.log('모든 환경변수:', Object.keys(env).filter(key => key.startsWith('VITE_')));
  console.log('전체 env 객체:', env);

  return defineConfig({
    server: {
      host: "::",
      port: 8081,
      strictPort: true,
      cors: true,
      proxy: {
        "/ws-chat": {
          target: env.VITE_WS_BASE_URL,
          ws: true,
          changeOrigin: true,
        },
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: "localhost",
        },
      },
    },
    plugins: [
      react(),
      Pages({
        dirs: "src/pages",
        extensions: ["tsx", "ts", "jsx", "js"],
        exclude: ["**/components/**"],
      }),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: mode === "development",
    },
    define: {
      global: "window",
    },
  });
});
