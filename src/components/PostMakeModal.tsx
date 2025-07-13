import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { uploadToS3WithFallback, S3UploadResult, FALLBACK_IMAGE_URL } from "@/lib/s3Utils";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PostMakeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostMakeModal = ({ isOpen, onClose }: PostMakeModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  // 파일 검증 함수 (공통 로직)
  const validateFile = (file: File): boolean => {
    // 파일 크기 제한 (1MB)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      setFileError("파일 크기는 1MB를 초과할 수 없습니다.");
      return false;
    }

    // 파일 타입 확인
    if (!file.type.startsWith('image/')) {
      setFileError("이미지 파일만 업로드할 수 있습니다.");
      return false;
    }

    setFileError("");
    return true;
  };

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  // 드래그 앤 드롭 핸들러들
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        setSelectedFile(null);
      }
    }
  };

  // "컴퓨터에서 선택" 버튼 클릭 핸들러
  const handleSelectFromComputer = () => {
    fileInputRef.current?.click();
  };

  // 게시하기 버튼 클릭 핸들러 (전역 S3 함수 사용)
  const handleSubmit = async () => {
    if (!selectedFile) {
      console.log('파일이 선택되지 않았습니다.');
      return;
    }

    setIsUploading(true);
    
    try {
      // 1. S3 업로드 처리
      console.log('🚀 S3 업로드 시작...');
      const result: S3UploadResult = await uploadToS3WithFallback(selectedFile);
      
      let finalImageUrl: string;
      
      if (result.success) {
        console.log('✅ S3 업로드 성공:', result.url);
        finalImageUrl = result.url;
      } else {
        console.log('❌ S3 업로드 실패:', result.error);
        finalImageUrl = FALLBACK_IMAGE_URL;
        console.log('🔄 대체 이미지 사용:', finalImageUrl);
      }
      
      // 2. 게시물 생성 API 호출
      console.log('📝 게시물 생성 API 호출...');
      const postData = {
        content: content,
        location: "SEOUL/KOREA",
        mediaUrls: [finalImageUrl]
      };
      
      const response = await apiClient.api.createPost(postData);
      console.log('📋 POST /api/posts 응답:', response);
      
      // 3. 성공 토스트 메시지 표시
      toast({
        title: "게시물 업로드에 성공했습니다.",
        duration: 3000,
      });
      
      // 4. 모달 닫기
      onClose();
      
    } catch (error) {
      console.error('❌ 게시물 생성 실패:', error);
      
      // 실패 토스트 메시지 표시
      toast({
        title: "게시물 업로드에 실패했습니다.",
        description: "다시 시도해주세요.",
        variant: "destructive",
        duration: 3000,
      });
      
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
        
        {/* Modal Header */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          새 게시물 만들기
        </h2>
        
        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
              rows={4}
              placeholder="무슨 일이 일어나고 있나요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {/* 내용 없을 때 빨간색 오류 메시지 표시 */}
            {content.trim() === '' && (
              <div className="text-sm text-red-600 mt-1">
                내용을 입력해주세요
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이미지 업로드
            </label>
            
            {/* 업로드 제한 안내 */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
              <div className="flex items-center text-blue-800">
                <Upload className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">업로드 안내</span>
              </div>
              <ul className="text-xs text-blue-700 mt-1 ml-6 space-y-1">
                <li>• 지원 형식: JPG, PNG</li>
                <li>• 최대 파일 크기: 1MB</li>
                <li>• 한 번에 하나의 이미지만 업로드 가능</li>
              </ul>
            </div>
            
            {/* 숨겨진 파일 입력 필드 */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* 컴퓨터에서 선택 버튼 (드래그 앤 드롭 지원) */}
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="w-full mb-2"
            >
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectFromComputer}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isDragging ? '파일을 놓으세요' : '컴퓨터에서 선택하거나 여기에 드래그하세요'}
              </Button>
            </div>
            
            {/* 선택된 파일 정보 표시 */}
            {selectedFile && (
              <div className="text-sm text-gray-600 mb-2">
                선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
              </div>
            )}
            
            {/* 에러 메시지 표시 */}
            {fileError && (
              <div className="text-sm text-red-600 mb-2">
                {fileError}
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              JPG, PNG 파일만 업로드 가능 (최대 1MB)
            </div>
          </div>
        </div>
        
        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 mt-6">
                      <Button
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              취소
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || !!fileError || content.trim() === '' || !selectedFile}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? '업로드 중...' : '게시하기'}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PostMakeModal; 