import { DatePicker } from '@/components/ui/date-picker';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Head from 'next/head';
import { useRouter } from 'next/router';

import AppLayout from '@/components/layouts/app-layout';
import { personSchema } from '@/components/modules/people/schemas/person-schema';
import {
  AsyncSearchableSelect,
  AsyncSearchableSelectOption,
} from '@/components/ui/async-searchable-select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormWithContext,
} from '@/components/ui/form';
import FormHeader from '@/components/ui/form-header';
import { FormSkeleton } from '@/components/ui/form-skeleton';
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
import { usePerson } from '@/hooks/people';
import { personUpdate, searchCities, searchCountries } from '@/services/people';
import { getServerError } from '@/utils/string';
import { CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Show } from '@/components/ui/show';

dayjs.extend(utc);

type PersonFormData = {
  name: string;
  japaneseName: string;
  areasSkillsHobbies: string;
  about: string;
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

const UpdatePeople = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const slugOrId = (router.query.id as string) ?? '';
  const [editMode, setEditMode] = useState(false);
  const [aboutEditorSeed, setAboutEditorSeed] = useState(0);

  const {
    data: personResponse,
    isLoading,
    refetch,
  } = usePerson(slugOrId, {
    enabled: !!slugOrId,
  });

  const person =
    personResponse?.result ?? personResponse?.data ?? personResponse;

  const defaultValues = useMemo<Partial<PersonFormData>>(() => {
    const falldownRaw = person?.falldown;
    const falldownOption =
      typeof falldownRaw === 'object' && falldownRaw?.value
        ? falldownRaw
        : FALLDOWN_OPTIONS.find(
            (o) =>
              o.value ===
              (typeof falldownRaw === 'string'
                ? falldownRaw
                : (falldownRaw as any)?.value)
          ) ?? FALLDOWN_OPTIONS[0];

    return {
      name: person?.name ?? '',
      japaneseName: person?.japaneseName ?? person?.japanese_name ?? '',
      areasSkillsHobbies:
        person?.areasSkillsHobbies ?? person?.areas_skills_hobbies ?? '',
      about: person?.about ?? person?.bio ?? '',
      cityId:
        person?.cityId ?? person?.city_id
          ? {
              value: person?.cityId ?? person?.city_id,
              label: person?.city?.name ?? '',
            }
          : undefined,
      countryCode:
        person?.countryCode ?? person?.country_code
          ? {
              value: person?.countryCode ?? person?.country_code,
              label: person?.country?.name ?? '',
            }
          : undefined,
      birthday: person?.birthday ?? undefined,
      falldown: falldownOption,
      falldownDate: person?.falldownDate ?? person?.falldown_date ?? undefined,
      image: person?.image ?? undefined,
    };
  }, [person]);

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
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (!person || Object.keys(defaultValues).length === 0) return;
    reset(defaultValues);
    const t = setTimeout(() => setAboutEditorSeed((s) => s + 1), 0);
    return () => clearTimeout(t);
  }, [person, reset, defaultValues]);

  const aboutEditorKey = `about-editor-${(person as any)?.id ?? ''}-${
    (person as any)?.about?.length ?? 0
  }-${aboutEditorSeed}`;

  const onSavedSuccess = (response: any) => {
    setEditMode(false);
    refetch();
    queryClient.invalidateQueries({ queryKey: ['person', slugOrId] });
    queryClient.invalidateQueries({ queryKey: ['people'] });
    const msg =
      response?.data?.message?.text ??
      response?.message?.text ??
      'Persona actualizada correctamente';
    toast.success(msg);
    router.push(`/dashboard/people`);
  };

  const { mutate: updatePerson, isLoading: savingLoading } = useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string | number;
      params: Record<string, any>;
    }) => personUpdate(id, params),
    onSuccess: onSavedSuccess,
    onError: (error: any) => {
      toast.error(getServerError(error) as string);
    },
  });

  const onSubmit = (data: PersonFormData) => {
    const pid = (person as any)?.id ?? slugOrId;
    const birthdayStr = data.birthday
      ? dayjs(data.birthday).format('YYYY-MM-DD HH:mm:ss')
      : null;
    const falldownDateStr = data.falldownDate
      ? dayjs(data.falldownDate).format('YYYY-MM-DD HH:mm:ss')
      : null;

    updatePerson({
      id: pid,
      params: {
        name: data.name,
        japanese_name: data.japaneseName,
        areas_skills_hobbies: data.areasSkillsHobbies,
        about: data.about,
        city_id: data.cityId.value,
        country_code: data.countryCode.value,
        falldown: data.falldown.value,
        birthday: birthdayStr,
        falldown_date: falldownDateStr,
        image: data.image ?? undefined,
      },
    });
  };

  return (
    <AppLayout
      header={
        <SectionHeader backlink="/dashboard/people" text="Edición de persona" />
      }>
      <Head>
        <title>
          Coanime.net - Edición: {(person as any)?.name ?? 'Persona'}
        </title>
      </Head>
      <article className="p-4 md:p-6">
        {isLoading && <FormSkeleton fields={8} />}
        <Show when={person}>
          <FormWithContext methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <FormHeader
              title={(person as any)?.name ?? ''}
              subtitle={
                (person as any)?.japaneseName ??
                (person as any)?.japanese_name ??
                ''
              }
              cancelAction={() => setEditMode(false)}
              editAction={() => setEditMode(true)}
              disabled={!editMode}
              isSaving={savingLoading}
              errors={errors || ([] as any[])}
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
                              disabled={!editMode}
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
                              disabled={!editMode}
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
                              disabled={!editMode}
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
                          <FormLabel>Biografía</FormLabel>
                          <FormControl>
                            <TextEditor
                              key={aboutEditorKey}
                              defaultValue={field.value || ''}
                              errors={errors?.about?.message}
                              onChange={(value: string) =>
                                field.onChange(value)
                              }
                              disabled={!editMode}
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
                              disabled={!editMode}
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
                              disabled={
                                !editMode || !watch('countryCode')?.value
                              }
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
                        disabled={!editMode}
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
                            }}
                            disabled={!editMode}>
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
                          disabled={!editMode}
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
                              modelId={(person as any)?.id}
                              showUrlOption={true}
                              disabled={!editMode}
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

export default UpdatePeople;
