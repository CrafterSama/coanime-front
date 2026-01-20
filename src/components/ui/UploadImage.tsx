import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import Image from 'next/image';

import { CloudUploadIcon } from '@/components/icons';
import { uploadImages } from '@/hooks/images';

import Label from './Label';
import { Show } from './Show';

const UploadImage = ({ disabled = false, name, model }) => {
  const { register, watch, setValue } = useFormContext();
  const [newImage, setNewImage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const uploadPostImages = async (e) => {
    setLoading(true);
    const images = e.target.files;
    try {
      const response = await uploadImages(images, model);
      if (response.status === 200) {
        setValue(name, response?.data?.url);
        setNewImage(true);
        return toast.success(response?.data?.message?.text);
      }
    } catch (error) {
      if (error.response.status === 413) {
        return toast.error(
          `Image upload failed, Error: La Imagen excede el Tamaño permitido.( 1.5MB)`
        );
      }
      return toast.error(
        `Image upload failed, Error: ${error.response?.data?.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <label
        htmlFor={name}
        className={`w-full max-w-md border-2 border-orange-400 bg-orange-50 hover:bg-orange-100 mx-auto rounded-lg px-4 py-2 flex flex-row justify-center content-center gap-2 text-orange-400 select-none ${
          !disabled
            ? 'opacity-100 cursor-pointer'
            : 'opacity-50 cursor-not-allowed'
        }`}>
        {loading ? (
          <CgSpinner className="animate-spin" />
        ) : (
          <>
            <CloudUploadIcon className="w-6 h-6" />
            <span className="text-orange-500 font-semibold">
              Cambiar Imagen
            </span>
          </>
        )}

        <input
          {...register(name)}
          className="hidden"
          type="file"
          id={name}
          name={name}
          disabled={disabled}
          onChange={uploadPostImages}
        />
      </label>
      <Show condition={newImage}>
        <Label htmlFor="image">Nueva Imagen</Label>
        <div className="relative w-full h-[280px]">
          <Image
            src={watch(name)}
            alt="New image"
            className="rounded-lg object-scale-down bg-gray-200"
            fill
            unoptimized
          />
        </div>
      </Show>
    </>
  );
};

export default UploadImage;
