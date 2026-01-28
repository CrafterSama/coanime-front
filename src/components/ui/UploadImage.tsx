import React, { useState } from 'react';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import { CloudUploadIcon } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { uploadImages } from '@/hooks/images';

import { Show } from './Show';

const UploadImage = ({
  disabled = false,
  modelId,
  name,
  model,
  onUploadSuccess,
}: {
  disabled?: boolean;
  modelId?: number | string | null;
  name: string;
  model: string;
  onUploadSuccess?: () => void;
}) => {
  const { watch, setValue } = useFormContext();
  const [newImage, setNewImage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const uploadPostImages = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setLoading(true);
    const images = e.target.files;
    if (!images) {
      setLoading(false);
      return;
    }
    try {
      const payload =
        modelId != null && modelId !== '' ? { model, modelId } : model;
      const response = await uploadImages(images, payload);
      if (response.status === 200) {
        setValue(name, response?.data?.url);
        setNewImage(true);
        toast.success(response?.data?.message?.text);
        onUploadSuccess?.();
        return;
      }
    } catch (error: any) {
      if (error?.response?.status === 413) {
        toast.error(
          `Image upload failed, Error: La Imagen excede el Tamaño permitido.( 1.5MB)`
        );
        return;
      }
      toast.error(
        `Image upload failed, Error: ${
          error?.response?.data?.message || 'Unknown error'
        }`
      );
      return;
    } finally {
      setLoading(false);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={`w-full max-w-md bg-orange-50 hover:bg-orange-100 mx-auto rounded-md px-4 py-2 flex flex-row justify-center content-center gap-2 text-orange-400 select-none shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] transition-shadow ${
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
      </button>

      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        id={name}
        name={name}
        disabled={disabled}
        onChange={uploadPostImages}
      />
      <Show when={newImage}>
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
