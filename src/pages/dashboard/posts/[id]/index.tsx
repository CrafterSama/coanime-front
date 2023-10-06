import { useCallback, useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { Controller, Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { TagsInput } from 'react-tag-input-component';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { CalendarIcon, XIcon } from '@/components/icons';
import AppLayout from '@/components/Layouts/AppLayout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/postSchema';
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import SectionHeader from '@/components/ui/SectionHeader';
import FormSelect from '@/components/ui/Select';
import { Show } from '@/components/ui/Show';
import TextEditor from '@/components/ui/TextEditor';
import UploadImage from '@/components/ui/UploadImage';
import { DEFAULT_IMAGE } from '@/constants/common';
import { usePost } from '@/hooks/posts';
import { useSearchTitle } from '@/hooks/titles';
import { postUpdate } from '@/services/posts';
import { getServerError } from '@/utils/string';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

dayjs.extend(utc);

const UpdatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);
  const id = router?.query?.id;
  const { data = {}, isLoading, refetch } = usePost(id as string);
  const { post, categories: categoriesData } = data;
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

  const resetPostInfo = useCallback(() => {
    setValue('title', post?.title);
    setValue('excerpt', post?.excerpt);
    setValue('content', post?.content);
    setValue('image', post?.image);
    setValue('tags', post?.tags?.map((tag) => tag.name));
    setValue('categoryId', {
      value: post?.categories?.id,
      label: post?.categories?.name,
    });
    setValue('postponedTo', new Date(post?.postponedTo));
  }, [post, setValue]);

  const postponed = watch('postponedTo');
  const title = watch('title');
  const excerpt = watch('excerpt');

  useEffect(() => {
    if (post) {
      resetPostInfo();
      onChangeTitle(title?.length ?? 0);
      onChangeExcerpt(excerpt?.length ?? 0);
    }
  }, [post, resetPostInfo]);

  const categories = categoriesData?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onSavedSuccess = (response) => {
    setEditMode(false);
    refetch();
    toast.success(response.data.message.text);
  };

  const { mutate: updatePost } = useMutation(
    ({ id, params }: { id: string; params: any }) => postUpdate(id, params)
  );

  const onSubmit = (data) => {
    const id = post?.id;
    const postponedTo = data.postponedTo
      ? dayjs(data.postponedTo).utc().format('YYYY-MM-DD HH:mm:ss')
      : dayjs().utc().format('YYYY-MM-DD HH:mm:ss');
    const params = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      tagId: data.tags,
      titleId: data.titleId,
      categoryId: data.categoryId.value,
      postponedTo: postponedTo,
    };

    updatePost(
      { id, params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
          queryClient.invalidateQueries(['post']);
        },
        onError: (error) => {
          console.log(getServerError(error));
          toast.error(getServerError(error) as string);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard/posts"
          text="Edición de Articulo"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Update Post: {post?.title}</title>
      </Head>
      <article className="p-4">
        {isLoading && (
          <div className="flex justify-center content-center min-w-screen min-h-screen">
            <Loading size={16} />
          </div>
        )}
        {post && (
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title={post?.title}
              subtitle={`Por: ${post?.users?.name}`}
              cancelAction={() => setEditMode(false)}
              editAction={() => setEditMode(true)}
              disabled={!editMode}
            />
            <div className="p-4 flex flex-col md:flex-row gap-4 rounded-b-lg">
              <div className="w-full md:w-8/12">
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Titulo"
                    id="title"
                    name="title"
                    errors={errors?.['title']?.message}
                    placeholder="Title"
                    className="w-full block text-lg"
                    defaultValue={post?.title}
                    disabled={!editMode}
                    charactersCount={titleCount}
                    onChange={(e) => onChangeTitle(e.target.value.length)}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Input
                    label="Excerpt"
                    id="excerpt"
                    name="excerpt"
                    errors={errors?.['excerpt']?.message}
                    placeholder="excerpt"
                    className="w-full block text-base"
                    defaultValue={post?.excerpt}
                    disabled={!editMode}
                    charactersCount={excerptCount}
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
                        disabled={!editMode}
                        defaultValue={post?.content}
                        errors={errors?.['content']?.message}
                        onChange={(value) => setValue('content', value)}
                      />
                    )}
                  />
                </div>
              </div>
              <div className="w-full md:w-4/12">
                <div className="mb-4 flex flex-col gap-3 datepicker-box">
                  <Label htmlFor="description">
                    Posponer hasta(Hora Local):
                  </Label>
                  <DateTimePicker
                    onChange={(value) => setValue('postponedTo', value)}
                    value={watch('postponedTo')}
                    format="dd-MM-yyyy hh:mm a"
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

                  <span className="text-sm font-bold">
                    {`Hora del Server: ${
                      postponed
                        ? dayjs(postponed).utc().format('DD-MM-YYYY hh:mm a')
                        : ''
                    }`}
                  </span>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label htmlFor="description">Categoria</Label>
                  <FormSelect
                    options={categories}
                    name="categoryId"
                    value={watch('categoryId')}
                    callBack={(option) => setValue('categoryId', option)}
                    errors={errors?.['category_id']?.message as string}
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Imagen Principal del Post</Label>
                  <div className="relative h-[300px]">
                    <Image
                      src={post?.image ? post?.image : DEFAULT_IMAGE}
                      alt={post?.title}
                      className="w-full rounded-lg object-cover"
                      fill
                    />
                  </div>
                  <UploadImage
                    disabled={!editMode}
                    name="image"
                    model="posts"
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Tags</Label>
                  <div className={`tags-box ${!editMode && 'disabled'}`}>
                    <TagsInput
                      separators={['Enter', ',']}
                      isEditOnRemove={true}
                      value={post?.tags?.map((tag) => tag.name)}
                      onChange={(tags) => setValue('tags', tags)}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label htmlFor="title_id">Serie Relacionada</Label>
                  <Show condition={post?.titles?.length > 0}>
                    <div className="flex flex-row gap-4">
                      <div className="relative w-20 h-32">
                        <Image
                          src={post?.titles?.[0]?.images?.name ?? DEFAULT_IMAGE}
                          alt={post?.titles?.[0]?.name}
                          className="w-full relative"
                          fill
                        />
                      </div>
                      <div className="">
                        <h3>
                          {post?.titles?.[0]?.name} (
                          {post?.titles?.[0]?.type?.name})
                        </h3>
                      </div>
                    </div>
                  </Show>
                  <Show condition={post?.titles?.length === 0}>
                    'No tiene Serie Relacionada'
                  </Show>
                  <Select
                    options={serieList}
                    isLoading={isLoadingSeries}
                    defaultValue={post?.titles?.[0]?.id}
                    placeholder="Asignar una serie"
                    onInputChange={(value) => setSerieName(value)}
                    onChange={(option: { value: any; label: any }) =>
                      setValue('titleId', option?.value)
                    }
                    isDisabled={!editMode}
                    menuPlacement="auto"
                    getOptionLabel={(option) =>
                      `${option?.label} (${option?.type})`
                    }
                  />
                  <input
                    {...register}
                    type="hidden"
                    id="title_id"
                    name="title_id"
                    defaultValue={post?.titles?.[0]?.id}
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

export default UpdatePost;
