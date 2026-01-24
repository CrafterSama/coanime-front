import { httpClient } from '@/lib/http';

export const uploadImages = async (files: FileList, model: string) => {
  const formData = new FormData();
  formData.append('model', model);
  formData.append('file', files[0], files[0].name);

  // httpClient ya tiene configurado:
  // - baseURL: '/internal'
  // - Interceptor que agrega automáticamente el token JWT
  // - Transformaciones de datos
  // - Manejo de errores 401
  return await httpClient.post('/upload-images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
