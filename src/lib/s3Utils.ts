// ========================================
// 🌐 s3Utils.ts - S3 업로드 전역 처리 유틸리티
// ========================================
// S3 파일 업로드와 실패 시 대체 이미지 처리를 담당하는 전역 함수들

// 🖼️ 대체 이미지 경로 (프로젝트 root의 fail_to_loading.jpg)
export const FALLBACK_IMAGE_URL = '/fail_to_loading.jpg';

// 📝 S3 업로드 결과 타입
export interface S3UploadResult {
  success: boolean;
  url: string;
  isFallback: boolean;
  error?: string;
}

/**
 * 🌐 S3에 파일 업로드 시도
 * @param file 업로드할 파일
 * @returns S3 업로드 결과 또는 대체 이미지 정보
 */
export const uploadToS3WithFallback = async (file: File): Promise<S3UploadResult> => {
  try {
    console.log('🚀 S3 업로드 시도 시작:', file.name);
    
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch('http://localhost:8080/api/s3', {
      method: 'POST',
      body: formData,
      credentials: 'include', // HTTP-only 쿠키 포함
    });

    if (!response.ok) {
      if (response.status === 500) {
        console.log('S3 연결 실패');
      }
      throw new Error(`S3 업로드 실패: ${response.status}`);
    }

    const uploadedUrls = await response.json();
    const uploadedUrl = uploadedUrls[0];
    
    if (!uploadedUrl) {
      throw new Error('S3 응답에서 URL을 받지 못했습니다.');
    }

    console.log('✅ S3 업로드 성공:', uploadedUrl);
    return {
      success: true,
      url: uploadedUrl,
      isFallback: false,
    };

  } catch (error) {
    console.error('❌ S3 업로드 에러:', error);
    
    // 네트워크 에러 등 연결 실패 시에도 "S3 연결 실패" 메시지 출력
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('S3 연결 실패');
    }

    // 대체 이미지 반환
    console.log('🔄 대체 이미지 사용:', FALLBACK_IMAGE_URL);
    return {
      success: false,
      url: FALLBACK_IMAGE_URL,
      isFallback: true,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
};

/**
 * 📂 여러 파일을 S3에 업로드
 * @param files 업로드할 파일 배열
 * @returns 각 파일의 업로드 결과 배열
 */
export const uploadMultipleToS3WithFallback = async (files: File[]): Promise<S3UploadResult[]> => {
  const results: S3UploadResult[] = [];
  
  for (const file of files) {
    const result = await uploadToS3WithFallback(file);
    results.push(result);
  }
  
  return results;
};

/**
 * 🛡️ 이미지 URL이 유효한지 확인하고 대체 이미지 반환
 * @param imageUrl 확인할 이미지 URL
 * @returns 유효한 URL 또는 대체 이미지 URL
 */
export const getSafeImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    console.log('🔄 이미지 URL이 없어 대체 이미지 사용:', FALLBACK_IMAGE_URL);
    return FALLBACK_IMAGE_URL;
  }
  
  return imageUrl;
};

/**
 * 📊 업로드 결과 요약 정보 생성
 * @param results 업로드 결과 배열
 * @returns 요약 정보
 */
export const getUploadSummary = (results: S3UploadResult[]) => {
  const totalFiles = results.length;
  const successCount = results.filter(r => r.success).length;
  const fallbackCount = results.filter(r => r.isFallback).length;
  
  return {
    totalFiles,
    successCount,
    fallbackCount,
    hasErrors: fallbackCount > 0,
    allSuccess: successCount === totalFiles,
  };
}; 