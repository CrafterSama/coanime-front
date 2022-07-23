import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';

export const CKEditorConfig = ({ uploadPostImages }) =>
  ClassicEditor.create(document.querySelector('#ckeditor'), {
    plugins: [SimpleUploadAdapter],
    toolbar: [],
    SimpleUpload: uploadPostImages,
  })
    .then((editor) => {
      console.log(editor);
    })
    .catch((error) => {
      console.error(error);
    });
