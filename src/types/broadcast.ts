export interface ImageSet {
  imageUrl: string;
  smallImageUrl: string;
  largeImageUrl: string;
}

export interface ImageFormats {
  jpg: ImageSet;
  webp: ImageSet;
}

export interface TrailerImages {
  imageUrl: string;
  smallImageUrl: string;
  mediumImageUrl: string;
  largeImageUrl: string;
  maximumImageUrl: string;
}

export interface Trailer {
  youtube_id: string;
  url: string;
  embedUrl: string;
  images: TrailerImages;
}

export interface Title {
  type: string;
  title: string;
}

export interface DateProp {
  day: number | null;
  month: number | null;
  year: number | null;
}

export interface Aired {
  from: string | null;
  to: string | null;
  prop: {
    from: DateProp;
    to: DateProp;
  };
  string: string;
}

export interface Broadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface Genre {
  malId: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeEntry {
  malId: number;
  url: string;
  images: ImageFormats;
  trailer: Trailer;
  approved: boolean;
  titles: Title[];
  title: string;
  titleEnglish: string | null;
  titleJapanese: string | null;
  titleSynonyms: string[];
  type: string;
  source: string;
  episodes: number | null;
  status: string;
  airing: boolean;
  aired: Aired;
  duration: string;
  rating: string;
  score: number | null;
  scored_by: number | null;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string | null;
  background: string;
  season: string;
  year: number;
  broadcast: Broadcast;
  producers: string[];
  licensors: string[];
  studios: string[];
  genres: Genre[];
  explicit_genres: Genre[];
  themes: Genre[];
  demographics: Genre[];
}
