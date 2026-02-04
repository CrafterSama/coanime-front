import { useEffect } from 'react';
import { DatePicker } from '@/components/ui/date-picker';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AppLayout from '@/components/layouts/app-layout';
import { companySchema } from '@/components/modules/entities/schemas/company-schema';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWithContext,
} from '@/components/ui/form';
import FormHeader from '@/components/ui/form-header';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormSkeleton } from '@/components/ui/form-skeleton';
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
import { useCompaniesFormFilters } from '@/hooks/companies';
import { companyCreate } from '@/services/companies-dashboard';
import { getServerError } from '@/utils/string';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { Show } from '@/components/ui/show';

dayjs.extend(utc);

type CompanyFormData = {
  name: string;
  about: string;
  countryCode: { value: string; label: string };
  website: string;
  foundationDate: Date | null;
  image?: string | null;
};

const CreateCompany = () => {
  const router = useRouter();
  const { data: filtersData, isLoading } = useCompaniesFormFilters();
  const countries = filtersData?.countries ?? [];

  const methods = useForm<CompanyFormData>({
    resolver: yupResolver(companySchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      about: '',
      website: '',
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = methods;

  useEffect(() => {
    register('name');
    register('about');
    register('countryCode');
    register('website');
    register('foundationDate');
    register('image');
  }, [register]);

  const countryOptions = countries.map((c: any, idx: number) => ({
    value: String(c.id ?? c.iso3 ?? ''),
    label: c.name,
    _key: `country-${String(c.id ?? c.iso3)}-${idx}`,
  }));

  const onSavedSuccess = (response: any) => {
    router.push('/dashboard/companies');
    const msg =
      response?.data?.message?.text ||
      response?.message?.text ||
      'Entidad creada correctamente';
    toast.success(msg);
  };

  const { mutate: createCompany, isLoading: savingLoading } = useMutation({
    mutationFn: (params: Record<string, any>) => companyCreate(params),
    onSuccess: onSavedSuccess,
    onError: (error: any) => {
      toast.error(getServerError(error) as string);
    },
  });

  const onSubmit = (data: CompanyFormData) => {
    const foundationStr = data.foundationDate
      ? dayjs(data.foundationDate).format('YYYY-MM-DD HH:mm:ss')
      : null;

    createCompany({
      name: data.name,
      about: data.about,
      country_code: data.countryCode.value,
      website: data.website,
      foundation_date: foundationStr,
      image: data.image ?? undefined,
    });
  };

  return (
    <AppLayout
      header={
        <SectionHeader backlink="/dashboard/companies" text="Crear entidad" />
      }>
      <Head>
        <title>Coanime.net - Crear entidad</title>
      </Head>
      <article className="p-4 md:p-6">
        <Show when={isLoading}>
          <FormSkeleton fields={6} />
        </Show>
        <Show when={!isLoading}>
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title="Nueva entidad"
              cancelAction={() => router.push('/dashboard/companies')}
              editAction={() => {}}
              isSaving={savingLoading}
            />
            <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 rounded-b-lg bg-white border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="w-full lg:w-8/12 space-y-6">
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Información básica
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: Studio Ghibli"
                              className="w-full block text-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="about"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripción</FormLabel>
                          <FormControl>
                            <TextEditor
                              defaultValue={field.value || ''}
                              errors={errors?.about?.message}
                              onChange={(value: string) =>
                                field.onChange(value)
                              }
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
                          <FormLabel>Web</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="url"
                              placeholder="https://..."
                              className="w-full block"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </div>

              <div className="w-full lg:w-4/12 space-y-6">
                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Ubicación y fechas
                  </h3>
                  <div className="space-y-4">
                    <FormField
                      control={control}
                      name="countryCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>País</FormLabel>
                          <Select
                            value={field.value?.value ?? ''}
                            onValueChange={(value) => {
                              const selected = countryOptions.find(
                                (c: any) => c.value === value
                              );
                              if (selected) {
                                field.onChange({
                                  value: selected.value,
                                  label: selected.label,
                                });
                              }
                            }}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un país" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countryOptions.map((c: any, idx: number) => (
                                <SelectItem
                                  key={c._key ?? `country-${c.value}-${idx}`}
                                  value={c.value}>
                                  {c.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                      <Label>Fecha de fundación (opcional)</Label>
                      <DatePicker
                        onChange={(value) => setValue('foundationDate', value)}
                        value={watch('foundationDate')}
                        format="dd-MM-yyyy"
                        calendarIcon={
                          <span className="text-orange-400">
                            <CalendarIcon className="w-6 h-6" />
                          </span>
                        }
                        clearIcon={
                          <span className="text-orange-400">
                            <XMarkIcon className="w-6 h-6" />
                          </span>
                        }
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Imagen
                  </h3>
                  <div className="space-y-2">
                    <Label>Logo (opcional)</Label>
                    <FormField
                      control={control}
                      name="image"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <UploadImage
                              name="image"
                              model="companies"
                              showUrlOption={true}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </section>
              </div>
            </div>
          </FormWithContext>
        </Show>
      </article>
    </AppLayout>
  );
};

export default CreateCompany;
