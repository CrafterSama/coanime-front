import { SunEditorOptions } from 'suneditor/src/options';

export const sunEditorOptions: SunEditorOptions = {
  buttonList: [
    [
      'undo',
      'redo',
      'fontSize',
      'formatBlock',
      'blockquote',
      'bold',
      'underline',
      'italic',
      'strike',
      'fontColor',
      'hiliteColor',
      'textStyle',
      'removeFormat',
      'outdent',
      'indent',
      'align',
      'horizontalRule',
      'list',
      'lineHeight',
      'link',
      'image',
      'video',
      /*'imageGallery',*/
      'showBlocks',
    ],
  ],
  /*imageUploadUrl: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/upload-images`,*/
};
