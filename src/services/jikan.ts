export const getJikanAnime = async ({ type, title }) => {
  const response = await fetch(
    `https://api.jikan.moe/v4/anime?type=${type}&q${title}`
  );
  return response;
};

export const getJikanManga = async ({ type, title }) => {
  const response = await fetch(
    `https://api.jikan.moe/v4/manga?type=${type}&q${title}`
  );
  return response;
};
