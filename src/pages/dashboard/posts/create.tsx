import { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Controller, Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { TagsInput } from 'react-tag-input-component';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { CalendarIcon, XIcon } from '@/components/icons';
import AppLayout from '@/components/Layouts/AppLayout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/postSchema';
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import SectionHeader from '@/components/ui/SectionHeader';
import FormSelect from '@/components/ui/Select';
import TextEditor from '@/components/ui/TextEditor';
import UploadImage from '@/components/ui/UploadImage';
import { useCategoriesList } from '@/hooks/categories';
import { useSearchTitle } from '@/hooks/titles';
import { postCreate } from '@/services/posts';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

dayjs.extend(utc);

const CreatePost = () => {
  const router = useRouter();
  const { data = {} } = useCategoriesList();
  const { categories: categoriesData } = data;
  const [serieName, setSerieName] = useState<string>('a');
  const [serieList, setSerieList] = useState<[]>();
  const [titleCount, setTitleCount] = useState(0);
  const [excerptCount, setExcerptCount] = useState(0);

  const { data: serieData = {}, isLoading: isLoadingSeries } = useSearchTitle({
    name: serieName,
  });

  const { result: series } = serieData;

  const onChangeTitle = (length) => {
    setTitleCount(length);
  };

  const onChangeExcerpt = (length) => {
    setExcerptCount(length);
  };

  useEffect(() => {
    if (series?.data?.length > 0) {
      setSerieList(
        series?.data?.map((serie) => ({
          label: serie.name,
          value: serie.id,
          type: serie.type?.name,
        }))
      );
    }
  }, [serieName, series]);

  const methods = useForm<Partial<Posts>>({
    resolver: yupResolver(postSchema) as Resolver<Partial<Posts>, any>,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = methods;

  const resetPostInfo = () => {
    register('title');
    register('content');
    register('excerpt');
    setValue('image', '');
    register('tags');
    register('categoryId');
    register('postponedTo');
  };

  const postponed = watch('postponedTo');

  useEffect(() => {
    resetPostInfo();
  }, []);

  const categories = categoriesData?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSavedSuccess = (response) => {
    toast.success(response.data.message.text);
    router.push('/dashboard/posts');
  };

  const { mutate: createPost, isLoading: savingLoading } = useMutation(
    ({ params }: { params: any }) => postCreate(params)
  );

  const onSubmit = (data) => {
    const postponed = data.postponedTo
      ? dayjs(data.postponedTo).utc().format('YYYY-MM-DD HH:mm:ss')
      : dayjs().format('YYYY-MM-DD HH:mm:ss');

    const params = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      tagId: data.tags,
      titleId: data.titleId,
      categoryId: data.categoryId.value,
      postponedTo: postponed,
    };

    createPost(
      { params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
        },
        onError: (message) => {
          toast.error(`Error: ${message}`);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard/posts"
          text="Creación de Articulo"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Creación de Articulo</title>
      </Head>
      <article className="p-4">
        <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <FormHeader
            title="Nuevo Post"
            cancelAction={() => router.push('/dashboard/posts')}
            editAction={() => {}}
            isSaving={savingLoading}
          />
          <div className="p-4 flex flex-col md:flex-row gap-4 rounded-b-lg">
            <div className="w-full md:w-8/12">
              <div className="mb-4 flex flex-col gap-2">
                <Input
                  label="Titulo"
                  {...register('title')}
                  id="title"
                  name="title"
                  errors={errors?.['title']?.message}
                  placeholder="Title"
                  className="w-full block text-lg"
                  lowerHint={titleCount}
                  onChange={(e) => onChangeTitle(e.target.value.length)}
                />
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Input
                  label="Excerpt"
                  {...register('excerpt')}
                  id="excerpt"
                  name="excerpt"
                  errors={errors?.['excerpt']?.message}
                  placeholder="excerpt"
                  className="w-full block text-base"
                  lowerHint={excerptCount}
                  onChange={(e) => onChangeExcerpt(e.target.value.length)}
                />
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Label htmlFor="content">Contenido</Label>
                <Controller
                  control={control}
                  name="content"
                  render={() => (
                    <TextEditor
                      errors={errors?.['content']?.message}
                      onChange={(value) => setValue('content', value)}
                      defaultValue=""
                    />
                  )}
                />
              </div>
            </div>
            <div className="w-full md:w-4/12">
              <div className="mb-4 flex flex-col gap-3 datepicker-box">
                <Label htmlFor="description">Posponer hasta(Hora Local):</Label>
                <DateTimePicker
                  onChange={(value) => setValue('postponedTo', value)}
                  minDate={new Date()}
                  format="dd-MM-yyyy hh:mm a"
                  value={watch('postponedTo')}
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
                />
                <span className="text-sm font-bold">
                  {`Hora del Server: ${
                    postponed
                      ? dayjs(postponed).utc().format('DD-MM-YYYY hh:mm a')
                      : ''
                  }`}
                </span>
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Label htmlFor="description">Categoría</Label>
                <FormSelect
                  options={categories}
                  name="categoryId"
                  value={watch('categoryId')}
                  callBack={(option) => setValue('categoryId', option)}
                  errors={errors?.['categoryId']?.message as string}
                />
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Label>Imagen Principal del Post</Label>
                <UploadImage name="image" model="posts" />
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Label>Tags</Label>
                <div className={`tags-box`}>
                  <TagsInput
                    onChange={(tags) => setValue('tags', tags)}
                    separators={['Enter', ',']}
                    isEditOnRemove={true}
                  />
                </div>
              </div>
              <div className="mb-4 flex flex-col gap-2">
                <Label htmlFor="title_id">Serie Relacionada</Label>
                <Select
                  options={serieList}
                  isLoading={isLoadingSeries}
                  placeholder="Asignar una serie"
                  onInputChange={(value) => setSerieName(value)}
                  onChange={(option: {
                    label: string;
                    value: number;
                    type: string;
                  }) => setValue('titleId', option?.value)}
                  getOptionLabel={(option: {
                    label: string;
                    value: number;
                    type: string;
                  }) => {
                    console.log(option);
                    return `${option?.label} (${option?.type})`;
                  }}
                />
                <input
                  {...register}
                  type="hidden"
                  id="titleId"
                  name="titleId"
                />
              </div>
            </div>
          </div>
        </FormWithContext>
      </article>
    </AppLayout>
  );
};

export default CreatePost;
