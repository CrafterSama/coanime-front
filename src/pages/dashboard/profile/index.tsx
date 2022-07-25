import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Head from 'next/head';
import Image from 'next/image';

import CameraIcon from '@/components/icons/CameraIcon';
import AppLayout from '@/components/Layouts/AppLayout';
import { FormWithContext } from '@/components/ui/Form';
import FormHeader from '@/components/ui/FormHeader';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Loading from '@/components/ui/Loading';
import TextArea from '@/components/ui/TextArea';
import { useProfile } from '@/hooks/users';
import TextEditor from '@/components/ui/TextEditor';

const Profile = () => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const { data = {}, isLoading } = useProfile();
  const { result, title, description } = data;

  console.log(result);

  const methods = useForm<any>();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Profile - {result?.name}
        </h2>
      }
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

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
                      onSubmit={handleSubmit(onSubmit)}
                    >
                      <FormHeader
                        title={''}
                        cancelAction={() => setEditMode(false)}
                        editAction={() => setEditMode(true)}
                        disabled={!editMode}
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
                                <div className="mt-1 flex items-center">
                                  <label
                                    htmlFor="avatar"
                                    className="text-sm font-medium text-gray-700 flex flex-row items-center justify-center cursor-pointer"
                                  >
                                    <input type="file" id="avatar" hidden />
                                    <span className="inline-block w-52 h-52 rounded-full overflow-hidden bg-gray-100 relative group">
                                      <Image
                                        src={result?.profilePhotoPath}
                                        layout="fill"
                                        alt="avatar"
                                        className="rounded-full w-full h-full"
                                      />
                                      <span className="bg-transparent group-hover:bg-slate-800 group-hover:bg-opacity-60 flex justify-center items-center w-full h-full absolute top-0 left-0 transition-all opacity-0 group-hover:opacity-50 text-white">
                                        <CameraIcon className="w-6 h-6" />
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Input
                                  label="Full Name"
                                  name="name"
                                  defaultValue={result?.name}
                                  placeholder="coanime..."
                                  errors={errors?.['name']?.message}
                                  disabled={!editMode}
                                />
                                <Input
                                  label="Email"
                                  name="email"
                                  defaultValue={result?.email}
                                  placeholder="coanime..."
                                  errors={errors?.['email']?.message}
                                  hint="You can't change your email, we never send spam to your email or share your personal info."
                                  disabled
                                />
                              </div>
                            </div>

                            <div className="w-9/12 flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <Label className="block text-sm font-medium text-gray-700">
                                  {' '}
                                  Cover photo{' '}
                                </Label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed min-h-[180px] rounded-md">
                                  <div className="space-y-1 text-center">
                                    <label
                                      htmlFor="cover"
                                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                    >
                                      <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                      >
                                        <path
                                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <div className="flex text-sm text-gray-600">
                                        <span className="w-full text-center">
                                          Upload a file
                                        </span>
                                        <input
                                          id="cover"
                                          name="cover"
                                          type="file"
                                          className="sr-only"
                                        />
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF up to 10MB
                                      </p>
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-6">
                                <Input
                                  label="Username"
                                  name="username"
                                  defaultValue={result?.username}
                                  placeholder="coanime..."
                                  errors={errors?.['username']?.message}
                                />
                                <Input
                                  label="Website"
                                  name="website"
                                  defaultValue={result?.website}
                                  placeholder="http://..."
                                  errors={errors?.['website']?.message}
                                />
                                <Input
                                  label="Twitter"
                                  name="twitter"
                                  defaultValue={result?.twitter}
                                  placeholder="http://..."
                                  errors={errors?.['twitter']?.message}
                                />
                                <Input
                                  label="Instagram"
                                  name="instagram"
                                  defaultValue={result?.instagram}
                                  placeholder="http://..."
                                  errors={errors?.['instagam']?.message}
                                />
                                <Input
                                  label="Facebook"
                                  name="facebook"
                                  defaultValue={result?.facebook}
                                  placeholder="http://..."
                                  errors={errors?.['facebook']?.message}
                                />
                                <Input
                                  label="Pinterest"
                                  name="pinterest"
                                  defaultValue={result?.pinterest}
                                  placeholder="http://..."
                                  errors={errors?.['pinterest']?.message}
                                />
                              </div>
                              <div className="flex flex-col gap-2">
                                <Label>About</Label>
                                <TextEditor
                                  defaultValue={result?.bio}
                                  errors={errors?.['bio']?.message}
                                  onChange={(value) => setValue('bio', value)}
                                  disabled={!editMode}
                                  height="200px"
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                  Brief description for your profile. URLs are
                                  hyperlinked.
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
