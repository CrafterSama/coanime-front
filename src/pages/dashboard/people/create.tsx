import { DatePicker } from '@/components/ui/date-picker';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AppLayout from '@/components/layouts/app-layout';
import { personSchema } from '@/components/modules/people/schemas/person-schema';
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
import {
  AsyncSearchableSelect,
  AsyncSearchableSelectOption,
} from '@/components/ui/async-searchable-select';
import { personCreate, searchCities, searchCountries } from '@/services/people';
import { getServerError } from '@/utils/string';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';

import { Show } from '@/components/ui/show';

dayjs.extend(utc);

type PersonFormData = {
  name: string;
  japaneseName: string;
  areasSkillsHobbies: string;
  bio: string;
  cityId: { value: number; label: string };
  countryCode: { value: string; label: string };
  birthday: Date | null;
  falldown: { value: string; label: string };
  falldownDate: Date | null;
  image?: string | null;
};

const FALLDOWN_OPTIONS = [
  { label: 'No', value: 'no' },
  { label: 'Sí', value: 'si' },
];

const defaultValues: Partial<PersonFormData> = {
  name: '',
  japaneseName: '',
  areasSkillsHobbies: '',
  bio: '',
  cityId: { value: 0, label: '' },
  countryCode: { value: '', label: '' },
  birthday: null,
  falldown: FALLDOWN_OPTIONS[0],
  falldownDate: null,
  image: undefined,
};

const CreatePeople = () => {
  const router = useRouter();

  const methods = useForm<PersonFormData>({
    resolver: yupResolver(personSchema) as any,
    mode: 'onChange',
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = methods;

  const onSavedSuccess = (response: any) => {
    router.push('/dashboard/people');
    const msg =
      response?.data?.message?.text ??
      response?.message?.text ??
      'Persona creada correctamente';
    toast.success(msg);
  };

  const { mutate: createPerson, isLoading: savingLoading } = useMutation({
    mutationFn: (params: Record<string, any>) => personCreate(params),
    onSuccess: onSavedSuccess,
    onError: (error: any) => {
      toast.error(getServerError(error) as string);
    },
  });

  const onSubmit = (data: PersonFormData) => {
    const birthdayStr = data.birthday
      ? dayjs(data.birthday).format('YYYY-MM-DD HH:mm:ss')
      : null;
    const falldownDateStr = data.falldownDate
      ? dayjs(data.falldownDate).format('YYYY-MM-DD HH:mm:ss')
      : null;

    createPerson({
      name: data.name,
      japanese_name: data.japaneseName,
      areas_skills_hobbies: data.areasSkillsHobbies,
      bio: data.bio,
      city_id: data.cityId.value,
      country_code: data.countryCode.value,
      falldown: data.falldown.value,
      birthday: birthdayStr,
      falldown_date: falldownDateStr,
      image: data.image ?? undefined,
    });
  };

  return (
    <AppLayout
      header={
        <SectionHeader
          backlink="/dashboard/people"
          text="Creación de persona"
        />
      }>
      <Head>
        <title>Coanime.net - Crear persona</title>
      </Head>
      <article className="p-4 md:p-6">
        <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <FormHeader
            title="Nueva persona"
            cancelAction={() => router.push('/dashboard/people')}
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
                            placeholder="Ej: Hayao Miyazaki"
                            className="w-full block text-lg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="japaneseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre en japonés</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: 宮崎 駿"
                            className="w-full block text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="areasSkillsHobbies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Áreas / Habilidades / Hobbies</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ej: Dirección, Guion, Animación"
                            className="w-full block text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografía</FormLabel>
                        <FormControl>
                          <TextEditor
                            defaultValue={field.value || ''}
                            errors={errors?.bio?.message}
                            onChange={(value: string) => field.onChange(value)}
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
                        <FormControl>
                          <AsyncSearchableSelect
                            value={field.value?.value}
                            label={field.value?.label}
                            onChange={(
                              opt: AsyncSearchableSelectOption | null
                            ) => {
                              field.onChange(
                                opt
                                  ? {
                                      value: String(opt.value),
                                      label: opt.label,
                                    }
                                  : { value: '', label: '' }
                              );
                              setValue('cityId', { value: 0, label: '' });
                            }}
                            fetchOptions={(q: string) => searchCountries(q)}
                            placeholder="Buscar país (mín. 3 caracteres)"
                            minChars={3}
                            debounceMs={400}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <AsyncSearchableSelect
                            value={field.value?.value}
                            label={field.value?.label}
                            onChange={(
                              opt: AsyncSearchableSelectOption | null
                            ) =>
                              field.onChange(
                                opt
                                  ? {
                                      value: Number(opt.value),
                                      label: opt.label,
                                    }
                                  : { value: 0, label: '' }
                              )
                            }
                            fetchOptions={(q: string) => {
                              const cc =
                                watch('countryCode')?.value?.toString();
                              if (!cc) return Promise.resolve([]);
                              return searchCities(q, cc);
                            }}
                            placeholder="Buscar ciudad (mín. 3 caracteres); selecciona país primero"
                            disabled={!watch('countryCode')?.value}
                            minChars={3}
                            debounceMs={400}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <Label>Fecha de nacimiento</Label>
                    <DatePicker
                      onChange={(value) => setValue('birthday', value)}
                      value={watch('birthday')}
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
                  <FormField
                    control={control}
                    name="falldown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fallecido</FormLabel>
                        <Select
                          value={field.value?.value?.toString() || ''}
                          onValueChange={(value) => {
                            const selected = FALLDOWN_OPTIONS.find(
                              (o) => o.value === value
                            );
                            if (selected) {
                              field.onChange(selected);
                              setValue('falldown', selected);
                            }
                          }}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="No / Sí">
                                {field.value?.label || ''}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FALLDOWN_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Show when={watch('falldown')?.value === 'si'}>
                    <div className="space-y-2">
                      <Label>Fecha de fallecimiento</Label>
                      <DatePicker
                        onChange={(value) => setValue('falldownDate', value)}
                        value={watch('falldownDate')}
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
                  </Show>
                </div>
              </section>

              <section className="bg-gray-50 rounded-md border border-gray-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Imagen
                </h3>
                <div className="space-y-2">
                  <Label>Foto (opcional)</Label>
                  <FormField
                    control={control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <UploadImage
                            name="image"
                            model="people"
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
      </article>
    </AppLayout>
  );
};

export default CreatePeople;
