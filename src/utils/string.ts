export const strLimit = (str, limit) => {
  if (str.length > limit) {
    return str.substring(0, limit) + '...';
  }
  return str;
};

export const extractText = (html) => {
  return new DOMParser().parseFromString(html, 'text/html').documentElement.textContent;
};
