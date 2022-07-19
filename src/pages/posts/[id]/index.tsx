import { useEffect, useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import { Editor } from '@tinymce/tinymce-react';
import axios from '@/lib/axios';
import { postUpdate, usePost } from '@/hooks/posts';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import AppLayout from '@/components/Layouts/AppLayout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/postSchema';
import Button from '@/components/ui/Button';
import Errors from '@/components/ui/Errors';
import { PencilIcon, CloudUploadIcon, CalendarIcon, XIcon } from '@/components/icons';
import FormSelect from '@/components/ui/Select';
import Image from 'next/future/image';
import { TagsInput } from 'react-tag-input-component';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';

const UpdatePost = () => {
  const editorRef = useRef(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);
  const id = router?.query?.id;
  const { data = {}, isLoading, isError } = usePost(id as string);
  console.log('data', data);

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

  useEffect(() => {
    if (post) {
      setValue('title', post?.title);
      setValue('content', post?.content);
      setValue('excerpt', post?.excerpt);
      setValue(
        'tags',
        post?.tags?.map((tag) => tag.name),
      );
      setValue('categoryId', { value: post?.categories?.id, label: post.categories.name });
      setValue('postponedTo', new Date(post?.postponedTo));
    }
  }, [post, setValue]);

  const categories = categoriesData?.map((category) => ({ value: category.id, label: category.name }));

  const InputTagStyles = {};
  console.log(watch('image'));

  const onSavedSuccess = () => {
    toast.success('Post saved successfully');
  };

  const uploadPostImages = async (blobInfo) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    try {
      const csrf = () => axios.get('/sanctum/csrf-cookie');
      await csrf();
      const { data } = await axios.put('/api/v1/post-image-upload', formData);
      toast.success('Image uploaded successfully');
      return data;
    } catch (error) {
      toast.error(`Image upload failed, Error: ${error.message}`);
      return error;
    }
  };

  const { mutate: updatePost } = useMutation(({ id, params }: { id: string; params: any }) => postUpdate(id, params), {
    onSettled: () => {
      queryClient.invalidateQueries(['post']);
    },
  });

  const onSubmit = (data) => {
    console.log(data);

    /*updatePost(
      { id, params },
      {
        onSuccess: () => {
          onSavedSuccess();
        },
      },
    );*/
  };

  return (
    <AppLayout
      header={
        <>
          <h2 className="font-semibold text-2xl text-gray-800 leading-tight">Update Post</h2>
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
          <FormProvider {...methods}>
            <form className="flex flex-col rounded-lg shadow-lg" onSubmit={handleSubmit(onSubmit)}>
              <header className="flex flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg">
                <h4 className="w-1/2 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-start items-center">
                  {post?.title}
                </h4>
                <div className="action-buttons w-1/2 flex flex-row gap-4 justify-end">
                  {editMode ? (
                    <>
                      <Button type="button" variant="text" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Guardar Post</Button>
                    </>
                  ) : (
                    <button className="flex justify-center content-center p-2 rounded-full text-orange-500 border-2 border-orange-500 bg-orange-200 hover:bg-orange-300 transition-all">
                      <PencilIcon className="w-6 h-6" onClick={() => setEditMode(true)} />
                    </button>
                  )}
                </div>
              </header>
              <div className="p-4 flex flex-row gap-4 rounded-b-lg">
                <div className="w-8/12">
                  <div className="mb-4 flex flex-col gap-2">
                    <Label htmlFor="title">Titulo</Label>
                    <Input
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
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Input
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
                    {errors?.['content']?.message && <span>{errors?.['content']?.message}</span>}
                    <Controller
                      control={control}
                      name="content"
                      render={() => (
                        <Editor
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue={post?.content}
                          apiKey={'uv4awo44pqxuyzdzr1e0v8tsvkri1foum7hcm06x6mub8c49'}
                          onEditorChange={() => setValue('content', editorRef?.current?.getContent())}
                          disabled={!editMode}
                          init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                              'advlist',
                              'autolink',
                              'lists',
                              'link',
                              'image',
                              'charmap',
                              'preview',
                              'anchor',
                              'searchreplace',
                              'visualblocks',
                              'code',
                              'fullscreen',
                              'insertdatetime',
                              'media',
                              'table',
                              'code',
                              'help',
                              'wordcount',
                            ],
                            toolbar:
                              'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat',
                            iframe_template_callback: (data) =>
                              `<iframe title="${data.title}" width="${data.width}" height="${data.height}" src="${data.source}"></iframe>`,
                            images_upload_handler: uploadPostImages,
                          }}
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
                    <Image src={watch('image')?.name ?? post?.image} alt={post?.title} className="w-full rounded-lg" />
                    <label
                      htmlFor="image"
                      className={`w-full max-w-md border-2 border-orange-400 bg-orange-50 hover:bg-orange-100  m-auto rounded-lg px-4 py-2 flex flex-row justify-center content-center gap-2 text-orange-400 select-none ${
                        editMode ? 'opacity-100 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <CloudUploadIcon className="w-6 h-6" />
                      <span className="text-orange-500 font-semibold">Cambiar Imagen</span>
                      <input
                        className="hidden"
                        type="file"
                        id="image"
                        name="image"
                        onChange={(e) => setValue('image', e.target.files)}
                        disabled={!editMode}
                      />
                    </label>
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
            </form>
          </FormProvider>
        )}
      </article>
    </AppLayout>
  );
};

export default UpdatePost;
