import dynamic from 'next/dynamic';

const SunEditorClient = dynamic(
  () => import('@/components/ui/sun-editor-client'),
  {
    ssr: false,
  }
);

export type TextEditorProps = {
  defaultValue?: string;
  onChange: (html: string) => void;
  errors?: string;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
};

const TextEditor = ({
  defaultValue = '',
  onChange,
  errors,
  disabled = false,
  width = '100%',
  height = '600px',
}: TextEditorProps) => {
  return (
    <div className="w-full">
      {errors && <p className="text-red-500 text-xs">{errors}</p>}
      <div className="texteditor-box">
        <SunEditorClient
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
};

export default TextEditor;
