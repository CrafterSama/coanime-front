import { httpClient } from '@/lib/http';

export type UploadImagesOptions = {
  model: string;
  modelId?: number | string | null;
};

export const uploadImages = async (
  files: FileList,
  modelOrOptions: string | UploadImagesOptions
) => {
  const model =
    typeof modelOrOptions === 'string' ? modelOrOptions : modelOrOptions.model;
  const modelId =
    typeof modelOrOptions === 'string' ? undefined : modelOrOptions.modelId;

  const formData = new FormData();
  formData.append('model', model);
  formData.append('file', files[0], files[0].name);
  if (modelId != null && modelId !== '') {
    formData.append('model_id', String(modelId));
  }

  return await httpClient.post('/upload-images', formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
};
