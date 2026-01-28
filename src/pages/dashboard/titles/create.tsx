import { useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MultiSelect from 'react-widgets/Multiselect';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AppLayout from '@/components/Layouts/AppLayout';
import { Titles } from '@/components/modules/titles/interfaces/titles';
import { titleSchema } from '@/components/modules/titles/schemas/titleSchema';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWithContext,
} from '@/components/ui/form';
import FormHeader from '@/components/ui/FormHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSkeleton } from '@/components/ui/form-skeleton';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextEditor from '@/components/ui/TextEditor';
import ToggleCheckbox from '@/components/ui/ToggleCheckbox';
import UploadImage from '@/components/ui/UploadImage';
import { useCreateTitle } from '@/hooks/titles';
import { titleCreate } from '@/services/titles';
import { getServerError } from '@/utils/string';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { Show } from '@/components/ui/Show';

dayjs.extend(utc);

const CreateTitle = () => {
  const router = useRouter();
  const { data = {}, isLoading } = useCreateTitle();
  const { genres, types, ratings } = data;
  const methods = useForm<Partial<Titles>>({
    resolver: yupResolver(titleSchema) as any,
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = methods;

  const statusOptions = [
    { label: 'Finalizado', value: 'Finalizado' },
    { label: 'En emisión', value: 'En emisión' },
    { label: 'Estreno', value: 'Estreno' },
    { label: 'Publicándose', value: 'Publicándose' },
  ];

  const resetTitleInfo = () => {
    register('name');
    register('sinopsis');
    register('otherTitles');
    register('images');
    register('justYear');
    register('typeId');
    register('ratingId');
    register('genreId');
    register('broadTime');
    register('broadFinish');
    register('episodies');
    register('status');
    register('trailerUrl');
  };

  useEffect(() => {
    resetTitleInfo();
  }, []);

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
    router.push('/dashboard/titles');
    toast.success(response.data.message.text);
  };

  const { mutate: createTitle, isLoading: savingLoading } = useMutation(
    ({ params }: { params: any }) => titleCreate(params)
  );

  const onSubmit = (data: any) => {
    const params = {
      ...data,
      ratingId: data.ratingId.value,
      typeId: data.typeId.value,
      genreId: data.genreId.map((g: any) => g.value),
      broadTime: dayjs(data.broadTime).format('YYYY-MM-DD'),
      broadFinish: dayjs(data.broadFinish).format('YYYY-MM-DD'),
      status: data.status.value,
      justYear: data.justYear === false ? 'false' : 'true',
    };
    createTitle(
      { params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
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
        <SectionHeader
          backlink="/dashboard/titles"
          text="Creación de títulos"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Creación de títulos</title>
      </Head>
      <article className="p-4 md:p-6">
        <Show when={isLoading}>
          <FormSkeleton fields={10} />
        </Show>
        <Show when={data}>
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title="Nuevo título"
              cancelAction={() => router.push('/dashboard/titles')}
              editAction={() => {}}
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
                      <UploadImage name="images" model="titles" />
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
                            }}>
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
                            }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una clasificación">
                                  {field.value
                                    ? `${field.value.label}${field.value.description ? ` (${field.value.description})` : ''}`
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
                      />
                    </div>
                    <div className="flex flex-row items-center gap-2 pt-1">
                      <ToggleCheckbox
                        name="justYear"
                        onChange={(e) =>
                          setValue('justYear', e.target.checked)
                        }
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
                              field.value?.value?.toString() || field.value || ''
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
                            }}>
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
        </Show>
      </article>
    </AppLayout>
  );
};

export default CreateTitle;
