export const strLimit = (str: string | undefined | null, limit: number) => {
  if (str && str.length > limit) {
    return str?.substring(0, limit) + '...';
  }
  return str;
};

export const extractText = (html: string | null | undefined): string => {
  if (!html) return '';
  const result = new DOMParser().parseFromString(html, 'text/html')
    .documentElement.textContent;
  return result || '';
};

export const strToSlug = (str: string | undefined) => {
  str = str?.replace(/^\s+|\s+$/g, ''); // trim
  str = str?.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åàáãäâèéëêìíïîòóöôōùúüûñç·_,:;/␣×';
  const to = 'aaaaaaeeeeiiiiooooouuuunc-------x';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str?.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    ?.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return str;
};

export const defaultImage = (string: string) =>
  string === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
    ? 'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg'
    : string;

export const getTitlesUrl = (type: string | number, title: string | number) => {
  return `/ecma/titulos/${strToSlug(String(type))}/${strToSlug(String(title))}`;
};

export const getServerError = (error: any): string => {
  const data = error?.response?.data;
  if (!data) return 'Error de conexión';

  // Laravel validation errors: { errors: { "field": ["msg"] } }
  const errors = data.errors;
  if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
    const flatMessages = Object.values(errors)
      .flat()
      .filter(Boolean) as string[];
    return flatMessages[0] ?? flatMessages.join(' ');
  }

  // API message: string or { text: string }
  const message = data.message;
  if (typeof message === 'string') return message;
  if (message && typeof message === 'object' && 'text' in message) {
    return typeof message.text === 'string'
      ? message.text
      : String(message.text);
  }

  return 'Error desconocido';
};

export const toSnakeCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');

export const keysToSnakeCase = (obj: any): any => {
  if (obj == null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((v) => keysToSnakeCase(v));
  }
  if (typeof obj === 'object' && obj.constructor === Object) {
    // eslint-disable-next-line
    return Object.keys(obj).reduce((result: any, key) => {
      const newKey = toSnakeCase(key);
      result[newKey] = keysToSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};
