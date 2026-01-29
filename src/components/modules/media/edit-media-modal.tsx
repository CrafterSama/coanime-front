'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaDetail, useUpdateMedia } from '@/hooks/media';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_IMAGE } from '@/constants/common';

interface EditMediaModalProps {
  mediaId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const EditMediaModal = ({
  mediaId,
  isOpen,
  onClose,
}: EditMediaModalProps) => {
  const { data, isLoading } = useMediaDetail(mediaId);
  const updateMedia = useUpdateMedia();
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const media = data?.data;

  // Load media data when modal opens
  useEffect(() => {
    if (media) {
      setName(media.name || '');
      setPreview(null);
      setFile(null);
      setImageUrl('');
    }
  }, [media]);

  // Preview: file (data URL) or imageUrl if valid
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (imageUrl.trim()) {
      setPreview(imageUrl.trim());
    } else {
      setPreview(null);
    }
  }, [file, imageUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Por favor selecciona un archivo de imagen');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('El archivo no debe exceder 10MB');
        return;
      }
      setFile(selectedFile);
      setImageUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !imageUrl.trim() && !name) {
      toast.error('Indica un nombre, sube un archivo o pega una URL');
      return;
    }
    if (file && imageUrl.trim()) {
      toast.error('Usa solo archivo o solo URL, no ambos');
      return;
    }
    setIsSubmitting(true);

    try {
      await updateMedia.mutateAsync({
        id: mediaId,
        name: name || undefined,
        file: file || undefined,
        url: imageUrl.trim() || undefined,
      });
      toast.success('Media actualizado correctamente');
      onClose();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Error al actualizar el media'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayUrl = preview || media?.thumbUrl || media?.url || DEFAULT_IMAGE;
  const isPlaceholder = media?.isPlaceholder;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium leading-6 text-gray-900">
            Editar Media
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-64 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : !media ? (
          <div className="text-center py-8 text-gray-500">
            No se pudo cargar la información del media
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Información del modelo */}
            {media.modelType && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Información del Modelo
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Tipo:</span>{' '}
                    <span className="font-medium">{media.modelType}</span>
                  </div>
                  {media.modelType === 'Title' && media.modelTitleType && (
                    <div>
                      <span className="text-gray-500">Tipo de título:</span>{' '}
                      <span className="font-medium">
                        {media.modelTitleType}
                      </span>
                    </div>
                  )}
                  {media.modelTitle && (
                    <div>
                      <span className="text-gray-500">Título:</span>{' '}
                      <span className="font-medium">{media.modelTitle}</span>
                    </div>
                  )}
                  {media.collectionName && (
                    <div>
                      <span className="text-gray-500">Colección:</span>{' '}
                      <span className="font-medium">
                        {media.collectionName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder warning */}
            {isPlaceholder && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <PhotoIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                      Este es un placeholder
                    </h4>
                    <p className="text-sm text-yellow-700">
                      El archivo original no está disponible. Puedes
                      reemplazarlo subiendo una nueva imagen.
                    </p>
                    {media.originalUrl && (
                      <p className="text-xs text-yellow-600 mt-2">
                        URL original: {media.originalUrl}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vista previa de la imagen */}
            <div>
              <Label>Vista Previa</Label>
              <div className="mt-2 relative w-full h-64 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                <Image
                  src={displayUrl}
                  alt={media.name || 'Media preview'}
                  fill
                  className="object-contain"
                  unoptimized
                />
                {isPlaceholder && !preview && (
                  <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center">
                    <div className="text-center">
                      <PhotoIcon className="h-12 w-12 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-yellow-700 font-medium">
                        Archivo no disponible
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nombre */}
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre del media"
                className="mt-2"
              />
            </div>

            {/* Reemplazar archivo */}
            <div>
              <Label htmlFor="file">
                {isPlaceholder
                  ? 'Subir Imagen'
                  : 'Reemplazar Imagen (Opcional)'}
              </Label>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <label htmlFor="file" className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-100 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors">
                      <div className="text-center">
                        <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {file
                            ? file.name
                            : 'Haz clic para seleccionar un archivo'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF hasta 10MB
                        </p>
                      </div>
                    </div>
                    <input
                      id="file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {file && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="mt-2">
                    <XMarkIcon className="h-4 w-4 mr-1" />
                    Quitar archivo
                  </Button>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Label htmlFor="image-url" className="text-gray-600">
                    O bien, pega la URL de la imagen
                  </Label>
                  <Input
                    id="image-url"
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value);
                      if (e.target.value.trim()) setFile(null);
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="mt-2"
                  />
                  {imageUrl.trim() && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageUrl('');
                        setPreview(null);
                      }}
                      className="mt-2">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Quitar URL
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Información del Archivo
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Archivo:</span>{' '}
                  <span className="font-medium">{media.fileName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Tipo:</span>{' '}
                  <span className="font-medium">{media.mimeType}</span>
                </div>
                {media.size > 0 && (
                  <div>
                    <span className="text-gray-500">Tamaño:</span>{' '}
                    <span className="font-medium">
                      {(media.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Disco:</span>{' '}
                  <span className="font-medium">{media.disk}</span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="solid-orange"
                disabled={isSubmitting || (!name && !file && !imageUrl.trim())}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
