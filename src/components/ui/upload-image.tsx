import React, { useState } from 'react';

import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

import { CloudUploadIcon } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { uploadImages } from '@/hooks/images';

import { Show } from './show';

const UploadImage = ({
  disabled = false,
  modelId,
  name,
  model,
  onUploadSuccess,
  showUrlOption = true,
}: {
  disabled?: boolean;
  modelId?: number | string | null;
  name: string;
  model: string;
  onUploadSuccess?: () => void;
  /** Show "Or paste image URL" option (for create/edit post and title forms) */
  showUrlOption?: boolean;
}) => {
  const { watch, setValue } = useFormContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

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
        setImageUrlInput('');
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

      {showUrlOption && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Label htmlFor={`${name}-url`} className="text-gray-600 text-sm">
            O pega la URL de la imagen
          </Label>
          <div className="mt-2 flex gap-2">
            <input
              id={`${name}-url`}
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              onBlur={() => {
                const url = imageUrlInput.trim();
                if (url) setValue(name, url);
              }}
              placeholder="https://ejemplo.com/imagen.jpg"
              disabled={disabled}
              className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => {
                const url = imageUrlInput.trim();
                if (url) {
                  setValue(name, url);
                  toast.success(
                    'URL asignada. Guarda el formulario para aplicar.'
                  );
                  onUploadSuccess?.();
                }
              }}
              disabled={disabled || !imageUrlInput.trim()}
              className="shrink-0 rounded-md bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed">
              Usar URL
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            La imagen se descargará al guardar (posts/títulos).
          </p>
        </div>
      )}

      <Show when={watch(name)}>
        <Label htmlFor="image" className="mt-4 block">
          Vista previa
        </Label>
        <div className="relative mt-2 w-full h-[280px]">
          <Image
            src={watch(name)}
            alt="Preview"
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
