import dynamic from 'next/dynamic';

import { sunEditorOptions } from '@/constants/suneditor';
import 'suneditor/dist/css/suneditor.min.css';
import { uploadImages } from '@/hooks/images';
import toast from 'react-hot-toast';

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
                  res = response;
                })
                .catch((error) => {
                  toast.error(error.message);
                });

              const response = {
                result: [
                  {
                    url: res?.data?.url,
                    name: files[0].name,
                    size: files[0].size,
                  },
                ],
              };

              uploadHandler(response);

              return undefined;
            }}
            onImageUploadError={(errorMessage, result) => {
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
