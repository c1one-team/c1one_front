import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 이미지 URL 처리 함수들
export function processImageUrl(url: string): string {
  // null, undefined, 빈 문자열 체크
  if (!url || url.trim() === '') {
    return '/fail_to_loading.jpg';
  }

  // 특정 임시 이미지 경로들을 대체 이미지로 변환
  const tempImagePaths = ['/temp_image.jpg', '/temp_image.png', '/temporary.jpg'];
  if (tempImagePaths.includes(url)) {
    return '/fail_to_loading.jpg';
  }

  // 상대 경로인 경우 절대 경로로 변환 (서버 이미지)
  if (url.startsWith('/') && !url.startsWith('//')) {
    // 이미 절대 경로인 경우 그대로 반환
    return url;
  }

  // 외부 URL인 경우 (http://, https://, //)
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) {
    return url;
  }

  // 기타 경우: 상대 경로로 간주하여 절대 경로로 변환
  return `/${url}`;
}

export function processMediaUrls(mediaUrls: string[]): string[] {
  if (!Array.isArray(mediaUrls)) {
    return ['/fail_to_loading.jpg'];
  }
  
  return mediaUrls.map(url => processImageUrl(url));
}

export function processRepresentativeImageUrl(url: string): string {
  return processImageUrl(url);
}

// 이미지 로드 에러 처리를 위한 헬퍼 함수
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>, originalUrl: string) {
  console.error('🚨 이미지 로드 실패:', originalUrl);
  console.error('🚨 전체 URL:', (e.target as HTMLImageElement).src);
  console.log('🔄 대체 이미지로 변경: /fail_to_loading.jpg');
  (e.target as HTMLImageElement).src = '/fail_to_loading.jpg';
}

// 이미지 로드 성공 로깅을 위한 헬퍼 함수
export function handleImageLoad(e: React.SyntheticEvent<HTMLImageElement>, originalUrl: string) {
  console.log('✅ 이미지 로드 성공:', originalUrl);
  console.log('✅ 전체 URL:', (e.target as HTMLImageElement).src);
}
