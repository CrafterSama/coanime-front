import { useEffect, useRef } from 'react';

import toast from 'react-hot-toast';
import suneditor, { plugins } from 'suneditor';
import 'suneditor/css/editor';

import { sunEditorOptions } from '@/constants/suneditor';
import { uploadImages } from '@/hooks/images';

type ImageUploadInfo = {
  files?: FileList | File[] | { name: string; size: number };
  url?: string;
};

type ImagePlugin = {
  submitURL: (url: string) => Promise<boolean>;
};

export type SunEditorClientProps = {
  defaultValue?: string;
  onChange: (html: string) => void;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
};

const applyDisabled = (instance: SunEditor.Instance, disabled: boolean) => {
  if (disabled) {
    instance.$.ui.readOnly(true);
    instance.$.ui.disable();
    return;
  }
  instance.$.ui.enable();
  instance.$.ui.readOnly(false);
};

const firstImageFile = (files: ImageUploadInfo['files']): File | null => {
  if (!files || !('length' in files) || files.length < 1) {
    return null;
  }

  const file = files[0];
  return file instanceof File ? file : null;
};

const uploadEditorImage = async (
  $: SunEditor.Deps,
  info: ImageUploadInfo
): Promise<boolean | void> => {
  if (info.url) {
    return true;
  }

  const file = firstImageFile(info.files);
  if (!file) {
    return false;
  }

  try {
    const response = await uploadImages([file], 'posts');
    const url = response?.data?.url;
    if (typeof url !== 'string' || url.length === 0) {
      toast.error('Image upload failed');
      return false;
    }

    const imagePlugin = $.plugins.image as ImagePlugin | undefined;
    if (!imagePlugin?.submitURL) {
      toast.error('Image upload failed');
      return false;
    }

    await imagePlugin.submitURL(url);
    return;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Image upload failed');
    return false;
  }
};

const SunEditorClient = ({
  defaultValue = '',
  onChange,
  disabled = false,
  width = '100%',
  height = '600px',
}: SunEditorClientProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<SunEditor.Instance | null>(null);
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);

  onChangeRef.current = onChange;
  disabledRef.current = disabled;

  useEffect(() => {
    const target = textareaRef.current;
    if (!target) {
      return;
    }

    const instance = suneditor.create(target, {
      plugins,
      ...sunEditorOptions,
      value: defaultValue,
      width,
      height,
      events: {
        onChange: ({ data }) => {
          onChangeRef.current(data);
        },
        onImageUploadBefore: ({ $, info }) => uploadEditorImage($, info),
        onImageUploadError: ({ error }) => {
          toast.error(error);
          return Promise.resolve();
        },
      },
    });

    editorRef.current = instance;
    applyDisabled(instance, disabledRef.current);

    return () => {
      instance.destroy();
      editorRef.current = null;
    };
  }, []);

  useEffect(() => {
    const instance = editorRef.current;
    if (!instance) {
      return;
    }
    applyDisabled(instance, disabled);
  }, [disabled]);

  return <textarea ref={textareaRef} defaultValue={defaultValue} />;
};

export default SunEditorClient;
