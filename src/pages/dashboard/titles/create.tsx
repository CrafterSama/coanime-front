import { useEffect } from 'react';
import DatePicker from 'react-datetime-picker';
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
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import SectionHeader from '@/components/ui/SectionHeader';
import FormSelect from '@/components/ui/Select';
import TextEditor from '@/components/ui/TextEditor';
import ToggleCheckbox from '@/components/ui/ToggleCheckbox';
import UploadImage from '@/components/ui/UploadImage';
import { useCreateTitle } from '@/hooks/titles';
import { titleCreate } from '@/services/titles';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import 'react-widgets/styles.css';
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

  const genresOptions = genres?.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));
  const typesOptions = types?.map((type) => ({
    value: type.id,
    label: type.name,
  }));
  const ratingsOptions = ratings?.map((rating) => ({
    value: rating.id,
    label: rating.name,
    description: rating.description,
  }));

  const onSavedSuccess = (response) => {
    router.push('/dashboard/titles');
    toast.success(response.data.message.text);
  };

  const { mutate: createTitle } = useMutation(({ params }: { params: any }) =>
    titleCreate(params)
  );

  const onHandleError = (error) => {
    return toast.error(
      error?.response?.data?.message?.text || error?.response?.data?.message
    );
  };

  const onSubmit = (data) => {
    const params = {
      ...data,
      ratingId: data.ratingId.value,
      typeId: data.typeId.value,
      genreId: data.genreId.map((g) => g.value),
      broadTime: dayjs(data.broadTime).format('YYYY-MM-DD'),
      broadFinish: dayjs(data.broadFinish).format('YYYY-MM-DD'),
      status: data.status.value,
      justYear: data.justYear === false ? 'false' : 'true',
    };
    //console.log('🚀 ~ file: index.tsx ~ line 114 ~ onSubmit ~ params', params);
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
                  <Input
                    label="Nombre del Titulo"
                    {...register('name')}
                    id="name"
                    name="name"
                    errors={errors?.['name']?.message}
                    placeholder="Dragon Ball Z"
                    className="w-full block text-lg"
                    defaultValue={watch('name')}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Otros Titulos"
                    {...register('otherTitles')}
                    hint="Separar con ','"
                    id="otherTitles"
                    name="otherTitles"
                    errors={errors?.['otherTitles']?.message}
                    placeholder="Dragon Ball Z, Dragon Ball"
                    className="w-full block text-lg"
                    defaultValue={watch('otherTitles')}
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
                              onChange={(value) => setValue('sinopsis', value)}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </FlexLayout>
              </div>
              <div className="w-full md:w-3/12">
                <div className="mb-4 flex flex-col gap-3">
                  <Label htmlFor="typeId">Tipo de Contenido</Label>
                  <FormSelect
                    options={typesOptions}
                    name="typeId"
                    value={watch('typeId')}
                    callBack={(option) => setValue('typeId', option)}
                    errors={errors?.['typeId']?.message as string}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-3">
                  <Label htmlFor="ratingId">Rating</Label>
                  <FormSelect
                    options={ratingsOptions}
                    getOptionLabel={(option) =>
                      `${option?.label} (${option?.description})`
                    }
                    name="ratingId"
                    value={watch('ratingId')}
                    callBack={(option) => setValue('ratingId', option)}
                    errors={errors?.['ratingId']?.message as string}
                  />
                </div>
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
                <div className="mb-4 flex flex-col gap-3">
                  <Label htmlFor="status">Estatus</Label>
                  <FormSelect
                    options={statusOptions}
                    name="status"
                    value={watch('status')}
                    callBack={(option) => setValue('status', option)}
                    errors={errors?.['status']?.message as string}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Episodios"
                    {...register('episodies')}
                    id="episodies"
                    name="episodies"
                    errors={errors?.['episodies']?.message}
                    placeholder="12"
                    className="w-full block text-lg"
                    defaultValue={watch('episodies')}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Url del Trailer"
                    {...register('trailerUrl')}
                    hint="work better with a youtube url"
                    id="trailerUrl"
                    name="trailerUrl"
                    errors={errors?.['trailerUrl']?.message}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full block text-lg"
                    defaultValue={watch('trailerUrl')}
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
