import { DatePicker } from '@/components/ui/date-picker';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TagsInput } from 'react-tag-input-component';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { CalendarIcon, XIcon } from '@/components/icons';
import AppLayout from '@/components/layouts/app-layout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/post-schema';
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
import { Input } from '@/components/ui/input';
import { SearchableSelect } from '@/components/ui/searchable-select';
import SectionHeader from '@/components/ui/section-header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TextEditor from '@/components/ui/text-editor';
import UploadImage from '@/components/ui/upload-image';
import { useCategoriesList } from '@/hooks/categories';
import { useSearchTitle } from '@/hooks/titles';
import { postCreate } from '@/services/posts';
import { getServerError } from '@/utils/string';
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

  const categories = categoriesData?.map((category: any) => ({
    value: category.id,
    label: category.name,
  }));

  const onSavedSuccess = (response: any) => {
    toast.success(response.data.message.text);
    router.push('/dashboard/posts');
  };

  const { mutate: createPost, isLoading: savingLoading } = useMutation(
    ({ params }: { params: any }) => postCreate(params)
  );

  const onSubmit = (data: any) => {
    const postponed = data.postponedTo
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
      postponedTo: postponed,
    };

    createPost(
      { params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
        },
        onError: (error) => {
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
          text="Creación de Articulo"
          errors={errors}
        />
      }>
      <Head>
        <title>Coanime.net - Creación de Articulo</title>
      </Head>
      <article className="p-6">
        <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <FormHeader
            title="Nuevo Post"
            cancelAction={() => router.push('/dashboard/posts')}
            editAction={() => {}}
            isSaving={savingLoading}
          />
          <div className="p-6 flex flex-col lg:flex-row gap-6 rounded-b-lg bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            {/* Columna Principal - Contenido */}
            <div className="w-full lg:w-8/12 space-y-6">
              {/* Sección: Información Básica */}
              <section className="bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Información Básica
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              {...field}
                              placeholder="Ingresa el título del artículo"
                              className="w-full block text-lg"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                field.onChange(e);
                                onChangeTitle(e.target.value.length);
                              }}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              {titleCount}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Extracto</FormLabel>
                        <FormControl>
                          <div>
                            <Input
                              {...field}
                              placeholder="Breve descripción del artículo"
                              className="w-full block text-base"
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                field.onChange(e);
                                onChangeExcerpt(e.target.value.length);
                              }}
                            />
                            <p className="text-sm text-muted-foreground mt-1">
                              {excerptCount}
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Sección: Contenido */}
              <section className="bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Contenido
                </h3>
                <FormField
                  control={control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuerpo del Artículo</FormLabel>
                      <FormControl>
                        <TextEditor
                          onChange={(value: string) => {
                            field.onChange(value);
                            setValue('content', value);
                          }}
                          defaultValue={field.value || ''}
                          errors={errors.content?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            </div>

            {/* Columna Lateral - Metadatos */}
            <div className="w-full lg:w-4/12 space-y-6">
              {/* Sección: Publicación */}
              <section className="bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Publicación
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="postponedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha y Hora de Publicación</FormLabel>
                        <FormControl>
                          <DatePicker
                            onChange={(value) => {
                              field.onChange(value);
                              setValue('postponedTo', value);
                            }}
                            value={field.value || watch('postponedTo')}
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
                          />
                        </FormControl>
                        {postponed && (
                          <FormDescription>
                            Hora del Servidor:{' '}
                            {dayjs(postponed)
                              .utc()
                              .format('DD-MM-YYYY hh:mm a')}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
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
                          }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría">
                              {field.value?.label || ''}
                            </SelectValue>
                          </SelectTrigger>
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
                </div>
              </section>

              {/* Sección: Multimedia */}
              <section className="bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Multimedia
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Imagen Principal</FormLabel>
                        <FormControl>
                          <UploadImage name="image" model="posts" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* Sección: Clasificación */}
              <section className="bg-gray-50 rounded-md shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Clasificación
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etiquetas</FormLabel>
                        <FormControl>
                          <div className="tags-box">
                            <TagsInput
                              onChange={(tags) => {
                                field.onChange(tags);
                                setValue('tags', tags);
                              }}
                              separators={['Enter', ',']}
                              isEditOnRemove={true}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="titleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serie Relacionada</FormLabel>
                        <FormControl>
                          <SearchableSelect
                            options={serieList || []}
                            value={field.value}
                            onValueChange={(value) => {
                              if (value !== null && value !== undefined) {
                                const numValue =
                                  typeof value === 'string'
                                    ? Number(value)
                                    : (value as number);
                                field.onChange(numValue);
                                setValue('titleId', numValue);
                              } else {
                                field.onChange(undefined);
                                setValue('titleId', undefined);
                              }
                            }}
                            onSearchChange={(search) => {
                              setSerieName(search);
                            }}
                            isLoading={isLoadingSeries}
                            placeholder="Seleccionar serie..."
                            getOptionLabel={(option) => {
                              return `${option.label} (${option.type || ''})`;
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>
            </div>
          </div>
        </FormWithContext>
      </article>
    </AppLayout>
  );
};

export default CreatePost;
