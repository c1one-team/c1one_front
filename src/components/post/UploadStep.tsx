import React, { useState } from 'react';
import { uploadImages } from '@/lib/s3'; // ⚠️ S3 업로드 util

const UploadStep = ({ setStep, setFile, setPreviewUrl, setMediaUrls }) => {
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files as FileList);
    if (selectedFiles.length === 0) return;

    setFile(selectedFiles[0]); // 첫 번째 파일 (대표용)
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrl(previews[0]);
    setLocalPreviews(previews);

    setLoading(true);
    try {
      // ✅ 여러 장 업로드
      const s3Urls = await uploadImages(selectedFiles);
      console.log('✅ S3 업로드 완료:', s3Urls);
      setMediaUrls(s3Urls);
      setStep(2); // 다음 단계로 이동
    } catch (error) {
      console.error('❌ S3 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-lg font-semibold mb-4">사진 업로드</h2>

      {localPreviews.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {localPreviews.map((preview, idx) => (
            <img key={idx} src={preview} alt={`미리보기-${idx}`} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>
      ) : (
        <label className="border border-dashed border-gray-400 p-8 rounded cursor-pointer hover:bg-gray-50">
          <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          <span className="text-gray-500">클릭하여 사진 선택</span>
        </label>
      )}

      {loading && <p className="mt-2 text-sm text-gray-500">업로드 중...</p>}
    </div>
  );
};

export default UploadStep;
