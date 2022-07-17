import { useRef, useState } from 'react';
import AppLayout from '@/components/Layouts/AppLayout';
import { Posts } from '@/components/modules/posts/interfaces/posts';
import { postSchema } from '@/components/modules/posts/schemas/postSchema';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { usePost, useUpdatePost } from '@/hooks/posts';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { Editor } from '@tinymce/tinymce-react';
import Errors from '@/components/ui/Errors';
import Loading from '@/components/ui/Loading';
import axios from '@/lib/axios';

const UpdatePost = () => {
  const editorRef = useRef(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<boolean>(false);
  const id = router?.query?.id;
  const { data: { post } = {}, isLoading, isError } = usePost(id as string);

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

  const onSavedSuccess = () => {
    toast.success('Post saved successfully');
  };

  const uploadPostImages = async blobInfo => {
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

  const { mutate: updatePost } = useMutation(
    ({ id, params }: { id: string; params: any }) => useUpdatePost(id, params),
    {
      onSettled: () => {
        queryClient.invalidateQueries(['post']);
      },
    },
  );

  const onSubmit = data => {
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
          <h2 className="font-semibold text-2xl text-gray-800 leading-tight">
            Update Post
          </h2>
          {/* Validation Errors */}
          <Errors errors={Object.values(errors)} />
        </>
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
          <FormProvider {...methods}>
            <form
              className="flex flex-col rounded-lg shadow-lg"
              onSubmit={handleSubmit(onSubmit)}>
              <header className="flex flex-row justify-between content-center p-4 bg-gray-100 rounded-t-lg">
                <h4 className="w-1/2 text-xl font-semibold text-gray-400 leading-tight m-0 flex justify-start items-center">
                  {post?.title}
                </h4>
                <div className="action-buttons w-1/2 flex flex-row gap-4 justify-end">
                  <Button type="button" variant="text">
                    Cancel
                  </Button>
                  <Button type="submit">Guardar Post</Button>
                </div>
              </header>
              <div className="p-4 flex flex-row gap-4 rounded-b-lg">
                <div className="w-9/12">
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
                    {errors?.['content']?.message && (
                      <span>{errors?.['content']?.message}</span>
                    )}
                    <Controller
                      control={control}
                      name="content"
                      render={() => (
                        <Editor
                          onInit={(evt, editor) => (editorRef.current = editor)}
                          initialValue={post?.content}
                          apiKey={
                            'uv4awo44pqxuyzdzr1e0v8tsvkri1foum7hcm06x6mub8c49'
                          }
                          onEditorChange={() =>
                            setValue(
                              'content',
                              editorRef?.current?.getContent(),
                            )
                          }
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
                            iframe_template_callback: data =>
                              `<iframe title="${data.title}" width="${data.width}" height="${data.height}" src="${data.source}"></iframe>`,
                            images_upload_handler: uploadPostImages,
                            content_style:
                              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="w-3/12">
                  <Label htmlFor="description">Categoria</Label>
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
