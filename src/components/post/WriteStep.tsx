import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPost, PostCreateRequest } from '@/lib/postApi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface WriteStepProps {
    file: File | null;
    previewUrl: string;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    mediaUrls: string[];
    onSubmit: () => void;
    onClose: () => void;
  }

  const WriteStep: React.FC<WriteStepProps> = ({
    file,
    previewUrl,
    description,
    setDescription,
    location,
    setLocation,
    mediaUrls,
    onSubmit,
    onClose,
  }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost: PostCreateRequest) => createPost(newPost),
    onSuccess: () => {
      alert('게시물이 성공적으로 업로드되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      onClose();
    },
    onError: (err: any) => {
      alert('게시 실패: ' + err.message);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    mutation.mutate({
      content: description,
      location: location,
      mediaUrls: mediaUrls,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <img src={previewUrl} alt="미리보기" className="w-full h-64 object-cover rounded" />
      <Input
        type="text"
        placeholder="설명 작성..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="text"
        placeholder="위치 추가"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
        <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? '업로드 중...' : '게시'}
        </Button>
    </form>
  );
};

export default WriteStep;
