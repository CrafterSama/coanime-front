import { DatePicker } from '@/components/ui/date-picker';
import { useCallback, useEffect, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
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
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWithContext,
} from '@/components/ui/form';
import { FormSkeleton } from '@/components/ui/form-skeleton';
import FormHeader from '@/components/ui/FormHeader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

  const onChangeTitle = (length: number) => {
    setTitleCount(length);
  };
  const onChangeExcerpt = (length: number) => {
    setExcerptCount(length);
  };

  useEffect(() => {
    if (series?.data?.length > 0) {
      setSerieList(
        series?.data?.map((serie: any) => ({
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
    setValue('tags', post?.tags?.map((tag: any) => tag.name));
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

  const categories = categoriesData?.map((category: any) => ({
    value: category.id,
    label: category.name,
  }));

  const onSavedSuccess = (response: any) => {
    setEditMode(false);
    refetch();
    toast.success(response.data.message.text);
  };

  const { mutate: updatePost } = useMutation(
    ({ id, params }: { id: string; params: any }) => postUpdate(id, params)
  );

  const onSubmit = (data: any) => {
    const id = post?.id;
    const postponedTo = data.postponedTo
      ? dayjs(data.postponedTo).format('YYYY-MM-DD HH:mm:ss')
      : dayjs().format('YYYY-MM-DD HH:mm:ss');

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
          if (process.env.NODE_ENV === 'development') {
            console.error('[Update Post Error]', getServerError(error));
          }
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
        {isLoading && <FormSkeleton fields={10} />}
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
                  <Label htmlFor="title">Titulo</Label>
                  <Input
                    {...register('title')}
                    id="title"
                    name="title"
                    placeholder="Title"
                    className="w-full block text-lg"
                    defaultValue={post?.title}
                    disabled={!editMode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      register('title').onChange(e);
                      onChangeTitle(e.target.value.length);
                    }}
                  />
                  {errors?.['title']?.message && (
                    <p className="text-sm text-red-500">
                      {errors['title']?.message as string}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{titleCount}</p>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Input
                    {...register('excerpt')}
                    id="excerpt"
                    name="excerpt"
                    placeholder="excerpt"
                    className="w-full block text-base"
                    defaultValue={post?.excerpt}
                    disabled={!editMode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      register('excerpt').onChange(e);
                      onChangeExcerpt(e.target.value.length);
                    }}
                  />
                  {errors?.['excerpt']?.message && (
                    <p className="text-sm text-red-500">
                      {errors['excerpt']?.message as string}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {excerptCount}
                  </p>
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
                        onChange={(value: string) => setValue('content', value)}
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
                  <DatePicker
                    onChange={(value) => setValue('postponedTo', value)}
                    value={watch('postponedTo')}
                    format="dd-MM-yyyy"
                    showTime={true}
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
                <FormField
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        value={field.value?.value?.toString() || ''}
                        onValueChange={(value) => {
                          const selectedCategory = categories?.find(
                            (cat: any) => cat.value.toString() === value
                          );
                          if (selectedCategory) {
                            field.onChange(selectedCategory);
                            setValue('categoryId', selectedCategory);
                          }
                        }}
                        disabled={!editMode}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría">
                              {field.value?.label || ''}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category: any) => (
                            <SelectItem
                              key={category.value}
                              value={category.value.toString()}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Imagen Principal del Post</Label>
                  <div className="relative h-[300px]">
                    <Image
                      src={post?.image ? post?.image : DEFAULT_IMAGE}
                      alt={post?.title}
                      className="w-full rounded-lg object-cover"
                      fill
                      unoptimized
                    />
                  </div>
                  <UploadImage
                    disabled={!editMode}
                    modelId={post?.id}
                    name="image"
                    model="posts"
                    onUploadSuccess={() => refetch()}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Tags</Label>
                  <div className={`tags-box ${!editMode && 'disabled'}`}>
                    <TagsInput
                      separators={['Enter', ',']}
                      isEditOnRemove={true}
                      value={post?.tags?.map((tag: any) => tag.name)}
                      onChange={(tags: string[]) => setValue('tags', tags)}
                      disabled={!editMode}
                    />
                  </div>
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label htmlFor="title_id">Serie Relacionada</Label>
                  <Show when={post?.titles?.length > 0}>
                    <div className="flex flex-row gap-4">
                      <div className="relative w-20 h-32">
                        <Image
                          src={post?.titles?.[0]?.images?.name ?? DEFAULT_IMAGE}
                          alt={post?.titles?.[0]?.name}
                          className="w-full relative"
                          fill
                          unoptimized
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
                  <Show when={post?.titles?.length === 0}>
                    'No tiene Serie Relacionada'
                  </Show>
                  <ReactSelect
                    options={serieList}
                    isLoading={isLoadingSeries}
                    defaultValue={post?.titles?.[0]?.id}
                    placeholder="Asignar una serie"
                    onInputChange={(value: string) => setSerieName(value)}
                    onChange={(option: { value: any; label: any }) =>
                      setValue('titleId', option?.value)
                    }
                    isDisabled={!editMode}
                    menuPlacement="auto"
                    getOptionLabel={(option: any) =>
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
