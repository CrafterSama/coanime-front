import { DatePicker } from '@/components/ui/date-picker';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MultiSelect from 'react-widgets/Multiselect';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import Image from 'next/image';

import AppLayout from '@/components/layouts/app-layout';
import { Titles } from '@/components/modules/titles/interfaces/titles';
import { titleSchema } from '@/components/modules/titles/schemas/title-schema';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWithContext,
} from '@/components/ui/form';
import FormHeader from '@/components/ui/form-header';
import { FormSkeleton } from '@/components/ui/form-skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionHeader from '@/components/ui/section-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextEditor from '@/components/ui/text-editor';
import ToggleCheckbox from '@/components/ui/toggle-checkbox';
import UploadImage from '@/components/ui/upload-image';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useTitle } from '@/hooks/titles';
import { titleUpdate } from '@/services/titles';
import { getServerError } from '@/utils/string';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

dayjs.extend(utc);

const UpdateTitle = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const { data = {}, isLoading, refetch } = useTitle({ id });
  const { data: title, genres, types, ratings } = data;
  const methods = useForm<Titles>({
    resolver: yupResolver(titleSchema) as any,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const statusOptions = [
    { label: 'Finalizado', value: 'Finalizado' },
    { label: 'En emisión', value: 'En emisión' },
    { label: 'Estreno', value: 'Estreno' },
    { label: 'Publicándose', value: 'Publicándose' },
  ];

  const resetTitleInfo = useCallback(() => {
    if (!title) return;
    const start = title.broadTime ? title.broadTime.split('-') : null;
    const finish = title.broadFinish ? title.broadFinish.split('-') : null;
    setValue('name', title.name);
    setValue('sinopsis', title.sinopsis);
    setValue('otherTitles', title.otherTitles);
    setValue(
      'images',
      title.coverImageUrl ?? title.cover_image_url ?? title.images?.name ?? ''
    );
    setValue('justYear', title.justYear === 'false' ? false : true);
    setValue('typeId', { value: title?.type?.id, label: title?.type?.name });
    setValue('ratingId', {
      value: title?.rating?.id,
      label: title?.rating?.name,
      description: title?.rating?.description,
    });
    setValue(
      'genreId',
      title.genres?.map((genre: any) => ({
        value: genre.id,
        label: genre.name,
      })) ?? []
    );
    setValue(
      'broadTime',
      title.broadTime
        ? new Date(
            Number(start?.[0]),
            Number(start?.[1]) - 1,
            Number(start?.[2])
          )
        : null
    );
    setValue(
      'broadFinish',
      title.broadFinish
        ? new Date(
            Number(finish?.[0]),
            Number(finish?.[1]) - 1,
            Number(finish?.[2])
          )
        : null
    );
    setValue('episodies', title.episodies);
    setValue('status', { value: title.status, label: title.status });
    setValue('trailerUrl', title.trailerUrl);
  }, [title, setValue]);

  useEffect(() => {
    if (title) {
      resetTitleInfo();
    }
  }, [title, resetTitleInfo]);

  const genresOptions = genres?.map((genre: any) => ({
    value: genre.id,
    label: genre.name,
  }));
  const typesOptions = types?.map((type: any) => ({
    value: type.id,
    label: type.name,
  }));
  const ratingsOptions = ratings?.map((rating: any) => ({
    value: rating.id,
    label: rating.name,
    description: rating.description,
  }));

  const onSavedSuccess = (response: any) => {
    setEditMode(false);
    refetch();
    toast.success(response.data.message.text);
  };

  const { mutate: updateTitle, isPending: savingLoading } = useMutation({
    mutationFn: ({ id, params }: { id: string; params: any }) =>
      titleUpdate(id, params),
    onSuccess: onSavedSuccess,
    onError: (error: any) => {
      toast.error(getServerError(error) as string);
    },
  });

  const onSubmit = (data: any) => {
    const params = {
      ...data,
      ratingId: data.ratingId.value,
      typeId: data.typeId.value,
      genreId: data.genreId.map((g: any) => g.value),
      broadTime: dayjs(data.broadTime).format('YYYY-MM-DD'),
      broadFinish: data.broadFinish
        ? dayjs(data.broadFinish).format('YYYY-MM-DD')
        : null,
      status: data.status.value,
      justYear: data.justYear === false ? 'false' : 'true',
    };
    updateTitle(
      { id: title?.id ?? id, params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
          queryClient.invalidateQueries({ queryKey: ['title'] });
        },
        onError: (error: any) => {
          toast.error(getServerError(error) as string);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <SectionHeader backlink="/dashboard/titles" text="Edición de título" />
      }>
      <Head>
        <title>Coanime.net - Edición: {title?.name ?? 'Título'}</title>
      </Head>
      <article className="p-4 md:p-6">
        {isLoading && <FormSkeleton fields={10} />}
        {title && (
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title={title?.name ?? ''}
              subtitle={title?.users?.name ? `Por: ${title.users.name}` : ''}
              cancelAction={() => setEditMode(false)}
              editAction={() => setEditMode(true)}
              disabled={!editMode}
              isSaving={savingLoading}
            />
            <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 rounded-b-lg bg-white border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              {/* Columna principal */}
              <div className="w-full lg:w-8/12 space-y-6">
                {/* Información básica */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Información básica
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del título</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: Dragon Ball Z"
                              className="w-full block text-lg"
                              disabled={!editMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="otherTitles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Otros títulos</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Dragon Ball Z, Dragon Ball"
                              className="w-full block text-base"
                              disabled={!editMode}
                            />
                          </FormControl>
                          <FormDescription>Separar con coma</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Géneros */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Géneros
                  </h3>
                  <FormField
                    control={control}
                    name="genreId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selecciona los géneros</FormLabel>
                        <FormControl>
                          <div className="genres">
                            <MultiSelect
                              dataKey="value"
                              textField="label"
                              value={field.value}
                              data={genresOptions || []}
                              onChange={field.onChange}
                              disabled={!editMode}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                {/* Portada y sinopsis */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Portada y sinopsis
                  </h3>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/4 shrink-0">
                      <Label className="block mb-2">Portada</Label>
                      <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
                        <Image
                          src={
                            title?.coverImageUrl ??
                            title?.cover_image_url ??
                            title?.images?.name ??
                            DEFAULT_IMAGE
                          }
                          alt={title?.name ?? ''}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <UploadImage
                        disabled={!editMode}
                        modelId={title?.id}
                        name="images"
                        model="titles"
                        onUploadSuccess={() => refetch()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <FormField
                        control={control}
                        name="sinopsis"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sinopsis</FormLabel>
                            <FormControl>
                              <TextEditor
                                disabled={!editMode}
                                defaultValue={field.value || ''}
                                errors={errors?.sinopsis?.message}
                                onChange={(value: string) => {
                                  field.onChange(value);
                                  setValue('sinopsis', value);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </section>
              </div>

              {/* Columna lateral */}
              <div className="w-full lg:w-4/12 space-y-6">
                {/* Tipo y clasificación */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Tipo y clasificación
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="typeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de contenido</FormLabel>
                          <Select
                            value={field.value?.value?.toString() || ''}
                            onValueChange={(value) => {
                              const selectedType = typesOptions?.find(
                                (type: any) => type.value.toString() === value
                              );
                              if (selectedType) {
                                field.onChange(selectedType);
                                setValue('typeId', selectedType);
                              }
                            }}
                            disabled={!editMode}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo">
                                  {field.value?.label || ''}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {typesOptions?.map((type: any) => (
                                <SelectItem
                                  key={type.value}
                                  value={type.value.toString()}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="ratingId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clasificación</FormLabel>
                          <Select
                            value={field.value?.value?.toString() || ''}
                            onValueChange={(value) => {
                              const selectedRating = ratingsOptions?.find(
                                (rating: any) =>
                                  rating.value.toString() === value
                              );
                              if (selectedRating) {
                                field.onChange(selectedRating);
                                setValue('ratingId', selectedRating);
                              }
                            }}
                            disabled={!editMode}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una clasificación">
                                  {field.value
                                    ? `${field.value.label}${
                                        field.value.description
                                          ? ` (${field.value.description})`
                                          : ''
                                      }`
                                    : ''}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ratingsOptions?.map((rating: any) => (
                                <SelectItem
                                  key={rating.value}
                                  value={rating.value.toString()}>
                                  {rating.label}{' '}
                                  {rating.description
                                    ? `(${rating.description})`
                                    : ''}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                {/* Fechas de emisión */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Fechas de emisión
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fecha de estreno</Label>
                      <DatePicker
                        onChange={(value) => setValue('broadTime', value)}
                        value={watch('broadTime')}
                        format="dd-MM-yyyy"
                        calendarIcon={
                          <span className="text-orange-400">
                            <CalendarIcon className="w-6 h-6" />
                          </span>
                        }
                        clearIcon={
                          <span className="text-orange-400">
                            <XMarkIcon className="w-6 h-6" />
                          </span>
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Fecha de término</Label>
                      <DatePicker
                        onChange={(value) => setValue('broadFinish', value)}
                        value={watch('broadFinish')}
                        format="dd-MM-yyyy"
                        calendarIcon={
                          <span className="text-orange-400">
                            <CalendarIcon className="w-6 h-6" />
                          </span>
                        }
                        clearIcon={
                          <span className="text-orange-400">
                            <XMarkIcon className="w-6 h-6" />
                          </span>
                        }
                        disabled={!editMode}
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2 pt-1">
                      <ToggleCheckbox
                        name="justYear"
                        onChange={(e) => setValue('justYear', e.target.checked)}
                        disabled={!editMode}
                        checked={watch('justYear')}
                      />
                      <Label className="mb-0 cursor-pointer">
                        Mostrar solo año
                      </Label>
                    </div>
                  </div>
                </section>

                {/* Estado y detalle */}
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Estado y detalle
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estatus</FormLabel>
                          <Select
                            value={
                              field.value?.value?.toString() ||
                              field.value ||
                              ''
                            }
                            onValueChange={(value) => {
                              const selectedStatus = statusOptions?.find(
                                (status: any) =>
                                  status.value.toString() === value
                              );
                              if (selectedStatus) {
                                field.onChange(selectedStatus);
                                setValue('status', selectedStatus);
                              }
                            }}
                            disabled={!editMode}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estatus">
                                  {field.value?.label || field.value || ''}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statusOptions?.map((status: any) => (
                                <SelectItem
                                  key={status.value}
                                  value={status.value.toString()}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="episodies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Episodios</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="12"
                              className="w-full block text-base"
                              disabled={!editMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="trailerUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL del tráiler</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://www.youtube.com/watch?v=..."
                              className="w-full block text-base"
                              disabled={!editMode}
                            />
                          </FormControl>
                          <FormDescription>
                            Funciona mejor con enlaces de YouTube
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </div>
            </div>
          </FormWithContext>
        )}
      </article>
    </AppLayout>
  );
};

export default UpdateTitle;

export async function getServerSideProps({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = params instanceof Promise ? await params : params;
  return {
    props: {
      id: resolvedParams.id,
    },
  };
}
