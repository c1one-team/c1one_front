import axios from 'axios';

export const uploadImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file); // ✅ key는 'files'로, 여러 개 추가
  });

  const response = await axios.post('/api/s3', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data; // [ 's3-url-1', 's3-url-2', ... ]
};
