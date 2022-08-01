import { useCallback, useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { TagsInput } from 'react-tag-input-component';

import format from 'date-fns/format';
import Image from 'next/future/image';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { CalendarIcon, XIcon } from '@/components/icons';
import AppLayout from '@/components/Layouts/AppLayout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/postSchema';
import Errors from '@/components/ui/Errors';
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import FormSelect from '@/components/ui/Select';
import TextEditor from '@/components/ui/TextEditor';
import UploadImage from '@/components/ui/UploadImage';
import { postUpdate, usePost } from '@/hooks/posts';
import { yupResolver } from '@hookform/resolvers/yup';

const UpdatePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);
  const id = router?.query?.id;
  const { data = {}, isLoading, refetch } = usePost(id as string);

  const { post, categories: categoriesData } = data;

  const methods = useForm<Posts>({
    resolver: yupResolver(postSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const resetPostInfo = useCallback(() => {
    setValue('title', post?.title);
    setValue('content', post?.content);
    setValue('excerpt', post?.excerpt);
    setValue('image', post?.image);
    setValue(
      'tags',
      post?.tags?.map((tag) => tag.name)
    );
    setValue('categoryId', {
      value: post?.categories?.id,
      label: post.categories.name,
    });
    setValue('postponedTo', new Date(post?.postponedTo));
  }, [post, setValue]);

  useEffect(() => {
    if (post) {
      resetPostInfo();
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

  const {
    mutate: updatePost,
  } = useMutation(({ id, params }: { id: string; params: any }) =>
    postUpdate(id, params)
  );

  const onSubmit = (data) => {
    const id = post?.id;
    const params = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      image: data.image,
      tagId: data.tags,
      categoryId: data.categoryId.value,
      postponedTo: format(new Date(data.postponedTo), 'yyy-MM-dd HH:mm:ss'),
    };

    updatePost(
      { id, params },
      {
        onSuccess: (response) => {
          onSavedSuccess(response);
          queryClient.invalidateQueries(['post']);
        },
        onError: (error) => {
          toast.error(error as string);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <>
          <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
            Update Post
          </h2>
          {/* Validation Errors */}
          <Errors errors={Object.values(errors)} />
        </>
      }
    >
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
            <div className="p-4 flex flex-row gap-4 rounded-b-lg">
              <div className="w-8/12">
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
              <div className="w-4/12">
                <div className="mb-4 flex flex-col gap-2 datepicker-box">
                  <Label htmlFor="description">Posponer hasta:</Label>
                  <DateTimePicker
                    onChange={(value) => setValue('postponedTo', value)}
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
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label htmlFor="description">Categoria</Label>
                  <FormSelect
                    options={categories}
                    name="categoryId"
                    value={watch('categoryId')}
                    callBack={(option) => setValue('categoryId', option)}
                    errors={errors?.['category_id']?.message}
                    disabled={!editMode}
                  />
                </div>
                <div className="mb-4 flex flex-col gap-2">
                  <Label>Imagen Principal del Post</Label>
                  <Image
                    src={post?.image}
                    alt={post?.title}
                    className="w-full rounded-lg"
                  />
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
                      value={post?.tags?.map((tag) => tag.name)}
                      onChange={(tags) => setValue('tags', tags)}
                      disabled={!editMode}
                    />
                  </div>
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
