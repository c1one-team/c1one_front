import React, { useState } from 'react';
import UploadStep from './UploadStep';
import WriteStep from './WriteStep';
import { createPost } from '@/lib/postApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      createPost({
        content: description,
        location,
        mediaUrls,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followingRecentPosts'] });
      alert('게시물이 업로드되었습니다!');
      handleClose(); // ✅ 성공 후에도 상태 초기화 포함해서 닫기
    },
    onError: (error) => {
      console.error('업로드 실패:', error);
      alert('게시물 업로드에 실패했습니다.');
    },
  });

  const handleSubmit = () => {
    if (mediaUrls.length === 0) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }
    mutation.mutate();
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setPreviewUrl('');
    setDescription('');
    setLocation('');
    setMediaUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-4 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={handleClose}>
          ✕
        </button>
        {step === 1 ? (
          <UploadStep
            setStep={setStep}
            setFile={setFile}
            setPreviewUrl={setPreviewUrl}
            setMediaUrls={setMediaUrls}
          />
        ) : (
          <WriteStep
            file={file}
            previewUrl={previewUrl}
            description={description}
            setDescription={setDescription}
            location={location}
            setLocation={setLocation}
            mediaUrls={mediaUrls}
            onSubmit={handleSubmit}
            onClose={handleClose} // ✅ WriteStep에서 닫기 눌러도 초기화 포함
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
