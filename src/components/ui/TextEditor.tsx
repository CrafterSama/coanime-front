import { forwardRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

type TextEditorProps = {
  id: string;
  name: string;
  errors?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
};

const TextEditor = forwardRef(
  ({ id, name, errors, defaultValue, onChange }: TextEditorProps, ref) => {
    console.log('refs', ref);
    return (
      <div className="w-full">
        {errors && <p className="text-red-500 text-xs">{errors}</p>}
        <Editor
          onInit={(evt, editor) => (ref.current = editor)}
          initialValue={defaultValue}
          apiKey={'uv4awo44pqxuyzdzr1e0v8tsvkri1foum7hcm06x6mub8c49'}
          onEditorChange={onChange}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen media',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | media' +
              'removeformat',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </div>
    );
  },
);

export default TextEditor;
