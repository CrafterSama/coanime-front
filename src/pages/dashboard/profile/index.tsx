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

import AppLayout from '@/components/layouts/app-layout';
import { FormWithContext } from '@/components/ui/form';
import FormHeader from '@/components/ui/form-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSkeleton } from '@/components/ui/form-skeleton';
import TextEditor from '@/components/ui/text-editor';
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
    handleSubmit,
    setValue,
    register,
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
    [result, setValue]
  );

  // const avatar = watch('avatar');
  // const cover = watch('cover');

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
          toast.error(error as string);
        },
      }
    );
  };

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Profile - {result?.name}
        </h2>
      }>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <div className="p-4">
        <div className="w-full">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg">
            {isLoading && <FormSkeleton fields={8} />}
            {result && (
              <>
                <div className="flex w-full">
                  <div className="flex flex-col w-full">
                    <FormWithContext
                      methods={methods}
                      onSubmit={handleSubmit(onSubmit)}>
                      <FormHeader
                        title={''}
                        cancelAction={() => setEditMode(false)}
                        editAction={() => setEditMode(true)}
                        disabled={!editMode}
                        isSaving={isSaving || uploadingImages}
                      />
                      <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                          <div className="flex flex-row gap-6">
                            <div className="w-3/12 pr-6">
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
                                          className="rounded-full w-full h-full"
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
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="name">Full Name</Label>
                                  <Input
                                    prefix={<UserIcon className="w-6 h-6" />}
                                    {...register('name')}
                                    id="name"
                                    name="name"
                                    defaultValue={result?.name}
                                    placeholder="coanime..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['name']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['name']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="email">Email</Label>
                                  <Input
                                    prefix={
                                      <EnvelopeIcon className="w-6 h-6" />
                                    }
                                    {...register('email')}
                                    id="email"
                                    name="email"
                                    defaultValue={result?.email}
                                    placeholder="coanime..."
                                    disabled
                                  />
                                  {errors?.['email']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['email']?.message as string}
                                    </p>
                                  )}
                                  <p className="text-sm text-muted-foreground">
                                    You can't change your email, we never send
                                    spam to your email or share your personal
                                    info.
                                  </p>
                                </div>
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
                                        className="w-full h-full"
                                        fill
                                        alt="cover"
                                        unoptimized
                                      />
                                      <span className="flex flex-col justify-center items-center w-full h-full absolute top-0 left-0 bg-transparent hover:bg-slate-800 hover:bg-opacity-25 transition-all text-white text-opacity-70 opacity-0 hover:opacity-90 cursor-pointer">
                                        <PencilIcon className="w-6 h-6" />
                                      </span>
                                    </div>
                                  </label>
                                ) : (
                                  <div className="mt-1 flex justify-center min-h-[180px] rounded-md overflow-hidden relative shadow-sm">
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
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="username">Username</Label>
                                  <Input
                                    prefix={
                                      <UserCircleIcon className="w-6 h-6" />
                                    }
                                    {...register('username')}
                                    id="username"
                                    name="username"
                                    defaultValue={result?.username}
                                    placeholder="coanime..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['username']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['username']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="website">Website</Label>
                                  <Input
                                    prefix={<LinkIcon className="w-6 h-6" />}
                                    {...register('website')}
                                    id="website"
                                    name="website"
                                    defaultValue={result?.website}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['website']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['website']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="twitter">Twitter</Label>
                                  <Input
                                    prefix={
                                      <AiOutlineTwitter className="w-6 h-6" />
                                    }
                                    {...register('twitter')}
                                    id="twitter"
                                    name="twitter"
                                    defaultValue={result?.twitter}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['twitter']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['twitter']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="instagram">Instagram</Label>
                                  <Input
                                    prefix={
                                      <AiOutlineInstagram className="w-6 h-6" />
                                    }
                                    {...register('instagram')}
                                    id="instagram"
                                    name="instagram"
                                    defaultValue={result?.instagram}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['instagam']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['instagam']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="facebook">Facebook</Label>
                                  <Input
                                    prefix={
                                      <AiOutlineFacebook className="w-6 h-6" />
                                    }
                                    {...register('facebook')}
                                    id="facebook"
                                    name="facebook"
                                    defaultValue={result?.facebook}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['facebook']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['facebook']?.message as string}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="youtube">Youtube</Label>
                                  <Input
                                    prefix={
                                      <AiOutlineYoutube className="w-6 h-6" />
                                    }
                                    {...register('youtube')}
                                    id="youtube"
                                    name="youtube"
                                    defaultValue={result?.youtube}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['youtube']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['youtube']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="tiktok">TikTok</Label>
                                  <Input
                                    prefix={<FaTiktok className="w-6 h-6" />}
                                    {...register('tiktok')}
                                    id="tiktok"
                                    name="tiktok"
                                    defaultValue={result?.tiktok}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['tiktok']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['tiktok']?.message as string}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-1">
                                  <Label htmlFor="pinterest">Pinterest</Label>
                                  <Input
                                    prefix={<FaPinterest className="w-6 h-6" />}
                                    {...register('pinterest')}
                                    id="pinterest"
                                    name="pinterest"
                                    defaultValue={result?.pinterest}
                                    placeholder="http://..."
                                    disabled={!editMode}
                                  />
                                  {errors?.['pinterest']?.message && (
                                    <p className="text-sm text-red-500">
                                      {errors['pinterest']?.message as string}
                                    </p>
                                  )}
                                </div>
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
    </AppLayout>
  );
};

export default Profile;
