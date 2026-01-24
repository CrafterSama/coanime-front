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
import Loading from '@/components/ui/Loading';
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
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { Show } from '@/components/ui/Show';
import FlexLayout from '@/components/ui/FlexLayout';

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

  const { mutate: createTitle } = useMutation(({ params }: { params: any }) =>
    titleCreate(params)
  );

  const onHandleError = (error: any) => {
    return toast.error(
      error?.response?.data?.message?.text || error?.response?.data?.message
    );
  };

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
        onError: (error) => {
          onHandleError(error);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard/posts"
          text="Creación de Titulos"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Create Title</title>
      </Head>
      <article className="p-4">
        <Show condition={isLoading}>
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading size={16} />
          </div>
        </Show>
        <Show condition={data}>
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title="Nuevo Titulo"
              cancelAction={() => router.push('/dashboard/titles')}
              editAction={() => {}}
            />
            <div className="p-4 flex flex-col md:flex-row gap-4 rounded-b-lg">
              <div className="w-full md:w-9/12">
                <div className="mb-4 flex flex-col gap-2">
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Titulo</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Dragon Ball Z"
                            className="w-full block text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <FormField
                    control={control}
                    name="otherTitles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Otros Titulos</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Dragon Ball Z, Dragon Ball"
                            className="w-full block text-lg"
                          />
                        </FormControl>
                        <FormDescription>Separar con ','</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Generos</Label>
                  <div className="genres">
                    <MultiSelect
                      dataKey="value"
                      textField="label"
                      value={watch('genreId')}
                      data={genresOptions}
                      onChange={(value) => setValue('genreId', value)}
                    />
                  </div>
                </div>
                <FlexLayout justify="start" direction="row" align="start">
                  <div className="mb-4 flex flex-col gap-2 w-full md:w-1/6">
                    <Label>Portada del Titulo</Label>
                    <UploadImage name="images" model="titles" />
                  </div>
                  <div className="w-full md:w-5/6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="mb-4 flex flex-col gap-2 w-full">
                        <Label htmlFor="sinopsis">Sinopsis</Label>
                        <Controller
                          control={control}
                          name="sinopsis"
                          render={() => (
                            <TextEditor
                              defaultValue={watch('sinopsis')}
                              errors={errors?.['sinopsis']?.message}
                              onChange={(value: string) =>
                                setValue('sinopsis', value)
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </FlexLayout>
              </div>
              <div className="w-full md:w-3/12">
                <FormField
                  control={control}
                  name="typeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Contenido</FormLabel>
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
                      <FormLabel>Rating</FormLabel>
                      <Select
                        value={field.value?.value?.toString() || ''}
                        onValueChange={(value) => {
                          const selectedRating = ratingsOptions?.find(
                            (rating: any) => rating.value.toString() === value
                          );
                          if (selectedRating) {
                            field.onChange(selectedRating);
                            setValue('ratingId', selectedRating);
                          }
                        }}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rating">
                              {field.value
                                ? `${field.value.label} (${
                                    field.value.description || ''
                                  })`
                                : ''}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ratingsOptions?.map((rating: any) => (
                            <SelectItem
                              key={rating.value}
                              value={rating.value.toString()}>
                              {rating.label} ({rating.description || ''})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mb-4 flex flex-col gap-2 datepicker-box">
                  <Label htmlFor="broadTime">Fecha de Estreno:</Label>
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
                <div className="mb-4 flex flex-col gap-2 datepicker-box">
                  <Label htmlFor="broadFinish">Fecha de termino:</Label>
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
                <div className="mb-4 flex flex-row items-center gap-2">
                  <Label htmlFor="justYear">Mostrar Solo Año:</Label>
                  <ToggleCheckbox
                    name="justYear"
                    onChange={(e) => setValue('justYear', e.target.checked)}
                    checked={watch('justYear')}
                  />
                </div>
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
                            (status: any) => status.value.toString() === value
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
                <div className="mb-4 flex flex-col gap-2">
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
                            className="w-full block text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <FormField
                    control={control}
                    name="trailerUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Url del Trailer</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className="w-full block text-lg"
                          />
                        </FormControl>
                        <FormDescription>
                          work better with a youtube url
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </FormWithContext>
        </Show>
      </article>
    </AppLayout>
  );
};
export default CreateTitle;
