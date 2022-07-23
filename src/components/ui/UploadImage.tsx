import { useState } from 'react';
import axios from '@/lib/axios';
import { httpClientAuth } from '@/lib/http';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CloudUploadIcon } from '@/components/icons';
import Label from './Label';
import Image from 'next/future/image';

const UploadImage = ({ disabled }) => {
  const { register, watch, setValue } = useFormContext();
  const [newImage, setNewImage] = useState<boolean>(false);

  const image = watch('image');
  const formData = new FormData();

  const uploadPostImages = async (e) => {
    const images = e.target.files;
    formData.append('file', images[0], images[0].name);
    try {
      const csrf = () => httpClientAuth.get('/sanctum/csrf-cookie');
      await csrf();
      const { data } = await axios.post('/api/v1/upload-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });
      toast.success(data.message.text);
      setValue('image', data.url);
      setNewImage(true);
    } catch (error) {
      toast.error(`Image upload failed, Error: ${error.message}`);
      return error;
    }
  };

  return (
    <>
      <label
        htmlFor="image"
        className={`w-full max-w-md border-2 border-orange-400 bg-orange-50 hover:bg-orange-100  m-auto rounded-lg px-4 py-2 flex flex-row justify-center content-center gap-2 text-orange-400 select-none ${
          !disabled
            ? 'opacity-100 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <CloudUploadIcon className="w-6 h-6" />
        <span className="text-orange-500 font-semibold">Cambiar Imagen</span>
        <input
          {...register('image')}
          className="hidden"
          type="file"
          id="image"
          name="file"
          disabled={disabled}
          onChange={uploadPostImages}
        />
      </label>
      {newImage && (
        <>
          <Label htmlFor="image">Nueva Imagen</Label>
          <Image
            src={watch('image')}
            alt={watch('title')}
            className="w-full rounded-lg"
          />
        </>
      )}
    </>
  );
};

export default UploadImage;
