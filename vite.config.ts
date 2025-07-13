import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import Pages from "vite-plugin-pages";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    strictPort: true, // 포트 고정
    cors: true, // CORS 활성화
    proxy: {
      '/ws-chat': {
      target: 'ws://localhost:8080',
      ws: true,
      changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  plugins: [
    react(),
    Pages({
      dirs: 'src/pages',
      extensions: ['tsx', 'ts', 'jsx', 'js'],
      exclude: ['**/components/**'],
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 개발 환경에서 더 나은 에러 처리
  build: {
    sourcemap: mode === 'development',
  },
  define: {
    global: 'window',
  },
}));
