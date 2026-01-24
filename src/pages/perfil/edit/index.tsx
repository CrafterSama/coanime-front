import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  AiOutlineInstagram,
  AiOutlineTwitter,
  AiOutlineFacebook,
  AiOutlineYoutube,
} from 'react-icons/ai';
import { FaTiktok, FaPinterest } from 'react-icons/fa';

import Head from 'next/head';
import Image from 'next/image';
import { GetServerSideProps } from 'next/types';

import WebLayout from '@/components/Layouts/WebLayout';
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
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/Loading';
import Section from '@/components/ui/Section';
import TextEditor from '@/components/ui/TextEditor';
import { uploadImages } from '@/hooks/images';
import { useProfile, updateMe } from '@/hooks/users';
import {
  LinkIcon,
  UserIcon,
  CameraIcon,
  PhotoIcon,
  UserCircleIcon,
  EnvelopeIcon,
  PencilIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Profile = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { data = {}, isLoading } = useProfile();
  const { result, title, description } = data;

  const methods = useForm<any>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const resetProfileData = useCallback(
    (result: any) => {
      setValue('name', result?.name);
      setValue('username', result?.username);
      setValue('email', result?.email);
      setValue('twitter', result?.twitter);
      setValue('instagram', result?.instagram);
      setValue('facebook', result?.facebook);
      setValue('youtube', result?.youtube);
      setValue('pinterest', result?.pinterest);
      setValue('bio', result?.bio);
      setValue('website', result?.website);
      setValue('cover', result?.profileCoverPath);
      setValue('avatar', result?.profilePhotoPath);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [result, setValue]
  );

  const uploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImages(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadingImages(false);
      return;
    }
    try {
      const response = await uploadImages(files, 'users');
      setValue('profilePhotoPath', response?.data?.url);
      toast.success('Profile photo uploaded successfully');
    } catch (error) {
      toast.error('Profile photo upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadingImages(true);
    const files = e.target.files;
    if (!files || files.length === 0) {
      setUploadingImages(false);
      return;
    }
    try {
      const response = await uploadImages(files, 'users');
      setValue('profileCoverPath', response?.data?.url);
      toast.success('Cover photo uploaded successfully');
    } catch (error) {
      toast.error('Cover photo upload failed');
    } finally {
      setUploadingImages(false);
    }
  };

  useEffect(() => {
    if (result) {
      resetProfileData(result);
    }
  }, [result, resetProfileData]);

  const { mutate: updateProfile, isLoading: isSaving } = useMutation(
    ({ params }: { params: any }) => updateMe(params)
  );

  const onHandleError = (error: any) => {
    if (
      error?.response?.status === 422 &&
      error?.response?.data?.errors?.password
    ) {
      error?.response?.data?.errors?.password?.map((err: string) =>
        toast.error(err)
      );
      return;
    }
    return toast.error(
      (error?.response?.data?.message as string) || (error?.message as string)
    );
  };

  const onSubmit = (data: any) => {
    if (data.avatar && !data.profilePhotoPath) {
      data.profilePhotoPath = data.avatar;
    }
    if (data.cover && !data.profileCoverPath) {
      data.profileCoverPath = data.cover;
    }
    const params = data;
    updateProfile(
      { params },
      {
        onSuccess: (response) => {
          toast.success(response.data.message.text);
          setEditMode(false);
          queryClient.invalidateQueries(['profile']);
        },
        onError: (error) => {
          onHandleError(error);
        },
      }
    );
  };

  return (
    <WebLayout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <Section withContainer>
        <div className="py-12">
          <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
            <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg">
              {isLoading && (
                <div className="flex justify-center content-center min-w-screen min-h-screen">
                  <Loading size={16} />
                </div>
              )}
              {result && (
                <>
                  <div className="flex w-full">
                    <div className="flex flex-col w-full">
                      <FormWithContext
                        methods={methods}
                        onSubmit={handleSubmit(onSubmit)}>
                        <FormHeader
                          title="Editar perfil"
                          cancelAction={() => setEditMode(false)}
                          editAction={() => setEditMode(true)}
                          disabled={!editMode}
                          isSaving={isSaving || uploadingImages}
                          overAll={false}
                        />
                        <div className="shadow sm:rounded-md sm:overflow-hidden">
                          <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                            <div className="flex flex-row gap-6">
                              <div className="w-3/12 pr-6 border-r-2 border-orange-200">
                                <div className="flex flex-col gap-2 mb-4">
                                  <Label className="block text-sm font-medium text-gray-700">
                                    {' '}
                                    Photo{' '}
                                  </Label>
                                  <div className="mt-1 flex justify-center items-center">
                                    <label
                                      htmlFor="avatar"
                                      className="text-sm font-medium text-gray-700 flex flex-row items-center justify-center cursor-pointer">
                                      <input
                                        type="file"
                                        id="avatar"
                                        hidden
                                        disabled={!editMode}
                                        onChange={(e) => uploadAvatar(e)}
                                      />
                                      <span className="inline-block w-52 h-52 rounded-full overflow-hidden bg-gray-100 relative group">
                                        {result?.profilePhotoPath && (
                                          <Image
                                            src={result?.profilePhotoPath}
                                            fill
                                            alt="avatar"
                                            className="rounded-full w-full h-full object-cover"
                                            unoptimized
                                          />
                                        )}
                                        <span className="bg-transparent group-hover:bg-slate-800 group-hover:bg-opacity-60 flex justify-center items-center w-full h-full absolute top-0 left-0 transition-all opacity-0 group-hover:opacity-50 text-white">
                                          <CameraIcon className="w-6 h-6" />
                                        </span>
                                      </span>
                                    </label>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <UserIcon className="w-6 h-6" />
                                            }
                                            placeholder="coanime..."
                                            disabled={!editMode}
                                            defaultValue={result?.name}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <EnvelopeIcon className="w-6 h-6" />
                                            }
                                            placeholder="coanime..."
                                            disabled
                                            defaultValue={result?.email}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          You can't change your email, we never
                                          send spam to your email or share your
                                          personal info.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                          <PasswordInput
                                            {...field}
                                            prefix={
                                              <LockClosedIcon className="w-6 h-6" />
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                              setValue(
                                                'password',
                                                e.target.value
                                              )
                                            }
                                            disabled={!editMode}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          Tu contraseña solo cambia si ingresa
                                          una nueva aquí. Importante: Su
                                          contraseña debe tener al menos 8
                                          caracteres y contener al menos un
                                          número y una letra mayúscula y
                                          minúscula y un símbolo.
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="passwordConfirmation"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>
                                          Password Confirmation
                                        </FormLabel>
                                        <FormControl>
                                          <PasswordInput
                                            {...field}
                                            prefix={
                                              <LockClosedIcon className="w-6 h-6" />
                                            }
                                            onChange={(
                                              e: React.ChangeEvent<HTMLInputElement>
                                            ) =>
                                              setValue(
                                                'passwordConfirmation',
                                                e.target.value
                                              )
                                            }
                                            disabled={!editMode}
                                          />
                                        </FormControl>
                                        <FormDescription>
                                          You need a password confirmation
                                        </FormDescription>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              </div>

                              <div className="w-9/12 flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                  <Label className="block text-sm font-medium text-gray-700">
                                    {' '}
                                    Cover photo{' '}
                                  </Label>
                                  {result?.profileCoverPath ? (
                                    <label htmlFor="cover">
                                      <div className="mt-1 flex justify-center min-h-[180px] rounded-md overflow-hidden relative">
                                        <Image
                                          src={result?.profileCoverPath}
                                          className="w-full h-full object-cover"
                                          fill
                                          alt={result?.name}
                                          unoptimized
                                        />
                                        <span className="flex flex-col justify-center items-center w-full h-full absolute top-0 left-0 bg-transparent hover:bg-slate-800 hover:bg-opacity-25 transition-all text-white text-opacity-70 opacity-0 hover:opacity-90 cursor-pointer">
                                          <PencilIcon className="w-6 h-6" />
                                        </span>
                                      </div>
                                    </label>
                                  ) : (
                                    <div className="mt-1 flex justify-center border-2 border-gray-100 border-dashed min-h-[180px] rounded-md overflow-hidden relative">
                                      <div className="space-y-1 text-center w-full">
                                        <label
                                          htmlFor="cover"
                                          className="flex flex-col h-full relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 text-center">
                                          <div className="flex justify-center items-center font-light text-gray-300">
                                            <PhotoIcon
                                              className="w-16 h-16"
                                              strokeWidth={1}
                                            />
                                          </div>
                                          <div className="flex text-sm text-gray-600">
                                            <span className="w-full text-center">
                                              Upload a file
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                          </p>
                                        </label>
                                      </div>
                                    </div>
                                  )}
                                  <input
                                    id="cover"
                                    name="cover"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => uploadCover(e)}
                                    disabled={!editMode}
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                  <FormField
                                    control={control}
                                    name="username"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <UserCircleIcon className="w-6 h-6" />
                                            }
                                            placeholder="coanime..."
                                            disabled={!editMode}
                                            defaultValue={result?.username}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="website"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <LinkIcon className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.website}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="twitter"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Twitter</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <AiOutlineTwitter className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.twitter}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="instagram"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Instagram</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <AiOutlineInstagram className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.instagram}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="facebook"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Facebook</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <AiOutlineFacebook className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.facebook}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="youtube"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Youtube</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <AiOutlineYoutube className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.youtube}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="tiktok"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>TikTok</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <FaTiktok className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.tiktok}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={control}
                                    name="pinterest"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Pinterest</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            prefix={
                                              <FaPinterest className="w-6 h-6" />
                                            }
                                            placeholder="http://..."
                                            disabled={!editMode}
                                            defaultValue={result?.pinterest}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Label>About</Label>
                                  <TextEditor
                                    defaultValue={result?.bio}
                                    errors={errors?.['bio']?.message as string}
                                    onChange={(value: string) =>
                                      setValue('bio', value)
                                    }
                                    disabled={!editMode}
                                    height="200px"
                                  />
                                  <p className="mt-2 text-sm text-gray-500">
                                    Brief description for your profile.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormWithContext>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Section>
    </WebLayout>
  );
};

export default Profile;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
