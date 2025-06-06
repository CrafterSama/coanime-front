export const strLimit = (str, limit) => {
  if (str?.length > limit) {
    return str?.substring(0, limit) + '...';
  }
  return str;
};

export const extractText = (html) => {
  return new DOMParser().parseFromString(html, 'text/html').documentElement
    .textContent;
};

export const strToSlug = (str) => {
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

export const defaultImage = (string) =>
  string === 'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
    ? 'https://coanime.s3.us-east-2.amazonaws.com/default-not-found.svg'
    : string;

export const getTitlesUrl = (type, title) => {
  return `/ecma/titulos/${strToSlug(String(type))}/${strToSlug(String(title))}`;
};

export const getServerError = (error) => {
  if (error?.response?.data?.message) {
    return error.response.data.message.text;
  }
  return error?.response?.data?.message;
};
