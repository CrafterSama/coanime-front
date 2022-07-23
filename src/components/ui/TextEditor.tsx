import dynamic from 'next/dynamic';

import { sunEditorOptions } from '@/constants/suneditor';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import('suneditor-react'), {
  ssr: false,
});

const TextEditor = ({ defaultValue, onChange, errors, disabled }) => {
  return (
    <div className="w-full">
      {errors && <p className="text-red-500 text-xs">{errors}</p>}
      {
        <div className="texteditor-box">
          <SunEditor
            setOptions={sunEditorOptions}
            width="100%"
            height="600px"
            defaultValue={defaultValue}
            readOnly={disabled}
            disable={disabled}
            onChange={(value) => onChange(value)}
            setAllPlugins={true}
            setDefaultStyle="font-family: Open sans; font-size: 16px;"
          />
        </div>
      }
    </div>
  );
};
export default TextEditor;
