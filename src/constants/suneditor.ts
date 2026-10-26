import type {} from 'suneditor';

export const sunEditorOptions: Pick<SunEditor.InitOptions, 'buttonList'> = {
  buttonList: [
    [
      'undo',
      'redo',
      'fontSize',
      'blockStyle',
      'blockquote',
      'bold',
      'underline',
      'italic',
      'strike',
      'fontColor',
      'backgroundColor',
      'textStyle',
      'removeFormat',
      'outdent',
      'indent',
      'align',
      'hr',
      'list',
      'lineHeight',
      'link',
      'image',
      'video',
      'showBlocks',
    ],
  ],
};
