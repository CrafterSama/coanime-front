import { useEffect, useState, useCallback } from 'react';
import DatePicker from 'react-datetime-picker/dist/entry.nostyle';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MultiSelect from 'react-widgets/Multiselect';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import Image from 'next/image';

import AppLayout from '@/components/Layouts/AppLayout';
import { Titles } from '@/components/modules/titles/interfaces/titles';
import { titleSchema } from '@/components/modules/titles/schemas/titleSchema';
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import SectionHeader from '@/components/ui/SectionHeader';
import FormSelect from '@/components/ui/Select';
import TextEditor from '@/components/ui/TextEditor';
import ToggleCheckbox from '@/components/ui/ToggleCheckbox';
import UploadImage from '@/components/ui/UploadImage';
import { DEFAULT_IMAGE } from '@/constants/common';
import { useTitle } from '@/hooks/titles';
import { titleUpdate } from '@/services/titles';
import { CalendarIcon, XIcon } from '@heroicons/react/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import 'react-widgets/styles.css';

dayjs.extend(utc);

const UpdateTitle = ({ id }) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const { data = {}, isLoading, refetch } = useTitle({ id });
  const { data: title, genres, types, ratings } = data;
  const methods = useForm<Titles>({
    resolver: yupResolver(titleSchema),
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
  ];

  const resetTitleInfo = useCallback(() => {
    const start = title.broadTime ? title.broadTime.split('-') : null;
    const finish = title.broadFinish ? title.broadFinish.split('-') : null;
    setValue('name', title.name);
    setValue('sinopsis', title.sinopsis);
    setValue('otherTitles', title.otherTitles);
    setValue('images', title.images ? title.images.name : '');
    setValue('justYear', title.justYear === 'false' ? false : true);
    setValue('typeId', { value: title?.type?.id, label: title?.type?.name });
    setValue('ratingId', {
      value: title?.rating?.id,
      label: title?.rating?.name,
      description: title?.rating?.description,
    });
    setValue(
      'genreId',
      title.genres.map((genre) => ({ value: genre.id, label: genre.name }))
    );
    setValue(
      'broadTime',
      title.broadTime ? new Date(start[0], start[1] - 1, start[2]) : null
    );
    setValue(
      'broadFinish',
      title.broadFinish ? new Date(finish[0], finish[1] - 1, finish[2]) : null
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
    setEditMode(false);
    refetch();
    toast.success(response.data.message.text);
  };

  const { mutate: updateTitle } = useMutation(
    ({ id, params }: { id: string; params: any }) => titleUpdate(id, params)
  );

  const onHandleError = (error) => {
    return toast.error(
      error?.response?.data?.message?.text || error?.response?.data?.message
    );
  };

  const onSubmit = (data) => {
    const id = title?.id;
    const params = {
      ...data,
      ratingId: data.ratingId.value,
      typeId: data.typeId.value,
      genreId: data.genreId.map((g) => g.value),
      broadTime: dayjs(data.broadTime).format('YYYY-MM-DD'),
      broadFinish: data.broadFinish
        ? dayjs(data.broadFinish).format('YYYY-MM-DD')
        : null,
      status: data.status.value,
      justYear: data.justYear === false ? 'false' : 'true',
    };
    //console.log('🚀 ~ file: index.tsx ~ line 114 ~ onSubmit ~ params', params);
    updateTitle(
      { id, params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
          queryClient.invalidateQueries(['title']);
        },
        onError: (error: { response }) => {
          onHandleError(error);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard/titles"
          text="Edición de Titulo"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Update Title: {title?.name}</title>
      </Head>
      <article className="p-4">
        {isLoading && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading size={16} />
          </div>
        )}
        {title && (
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title={title?.name}
              subtitle={`Por: ${title?.users?.name}`}
              cancelAction={() => setEditMode(false)}
              editAction={() => setEditMode(true)}
              disabled={!editMode}
            />
            <div className="p-4 flex flex-col md:flex-row gap-4 rounded-b-lg">
              <div className="w-full md:w-9/12">
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Nombre del Titulo"
                    id="name"
                    name="name"
                    errors={errors?.['name']?.message}
                    placeholder="Dragon Ball Z"
                    className="w-full block text-lg"
                    defaultValue={watch('name')}
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Otros Titulos"
                    hint="Separar con ','"
                    id="otherTitles"
                    name="otherTitles"
                    errors={errors?.['name']?.message}
                    placeholder="Dragon Ball Z, Dragon Ball"
                    className="w-full block text-lg"
                    defaultValue={watch('otherTitles')}
                    disabled={!editMode}
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
                      disabled={!editMode}
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="mb-4 flex flex-col gap-2 w-full md:w-5/6">
                    <Label htmlFor="sinopsis">Sinopsis</Label>
                    <Controller
                      control={control}
                      name="sinopsis"
                      render={() => (
                        <TextEditor
                          disabled={!editMode}
                          defaultValue={title?.sinopsis}
                          errors={errors?.['sinopsis']?.message}
                          onChange={(value) => setValue('sinopsis', value)}
                        />
                      )}
                    />
                  </div>
                  <div className="mb-4 flex flex-col gap-2 w-full md:w-1/6">
                    <Label>Portada del Titulo</Label>
                    <div className="flex relative mx-auto h-[280px] w-full">
                      <Image
                        src={title?.images?.name ?? DEFAULT_IMAGE}
                        alt={title?.name}
                        fill
                        className="rounded-lg object-scale-down bg-gray-200"
                      />
                    </div>
                    <UploadImage
                      disabled={!editMode}
                      name="images"
                      model="titles"
                    />
                  </div>
                </div>
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
                    disabled={!editMode}
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
                    disabled={!editMode}
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
                    clearIcon={false}
                    disabled={!editMode}
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
                        <XIcon className="w-6 h-6" />
                      </span>
                    }
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-row items-center gap-2">
                  <Label htmlFor="justYear">Mostrar Solo Año:</Label>
                  <ToggleCheckbox
                    name="justYear"
                    onChange={(e) => setValue('justYear', e.target.checked)}
                    disabled={!editMode}
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
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Episodios"
                    id="episodies"
                    name="episodies"
                    errors={errors?.['episodies']?.message}
                    placeholder="12"
                    className="w-full block text-lg"
                    defaultValue={watch('episodies')}
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Url del Trailer"
                    hint="work better with a youtube url"
                    id="trailerUrl"
                    name="trailerUrl"
                    errors={errors?.['trailerUrl']?.message}
                    placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    className="w-full block text-lg"
                    defaultValue={watch('trailerUrl')}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </div>
          </FormWithContext>
        )}
      </article>
    </AppLayout>
  );
};
export default UpdateTitle;

export async function getServerSideProps({ params }) {
  return {
    props: {
      id: params.id,
    },
  };
}
