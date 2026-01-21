import axios from '@/lib/axios';
import { httpClientAuth } from '@/lib/http';

export const uploadImages = async (files: FileList, model: string) => {
  const formData = new FormData();
  formData.append('model', model);
  formData.append('file', files[0], files[0].name);
  const csrf = () => httpClientAuth.get('/sanctum/csrf-cookie');
  await csrf();
  return await axios.post('/internal/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: 'application/json',
    },
  });
};
