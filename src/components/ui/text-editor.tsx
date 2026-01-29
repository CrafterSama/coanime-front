// @ts-nocheck
import toast from 'react-hot-toast';

import dynamic from 'next/dynamic';

import { uploadImages } from '@/hooks/images';
import { sunEditorOptions } from '@/constants/suneditor';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

const TextEditor = ({
  defaultValue,
  onChange,
  errors,
  disabled = false,
  width = '100%',
  height = '600px',
}) => {
  return (
    <div className="w-full">
      {errors && <p className="text-red-500 text-xs">{errors}</p>}
      {
        <div className="texteditor-box">
          <SunEditor
            setOptions={sunEditorOptions}
            width={width}
            height={height}
            defaultValue={defaultValue}
            readOnly={disabled}
            disable={disabled}
            onChange={(value) => onChange(value)}
            onImageUploadBefore={async (files, info, uploadHandler) => {
              let res = null;
              await uploadImages(files, 'posts')
                .then((response) => {
                  res = {
                    result: [
                      {
                        url: response?.data?.url,
                        name: files[0].name,
                        size: files[0].size,
                      },
                    ],
                  };
                  uploadHandler(res);
                })
                .catch((error) => {
                  toast.error(error.message);
                });

              return undefined;
            }}
            onImageUploadError={(errorMessage) => {
              toast.error(errorMessage);
            }}
            setAllPlugins={true}
            setDefaultStyle="font-family: Red Hat Text; font-size: 16px;"
          />
        </div>
      }
    </div>
  );
};
export default TextEditor;
