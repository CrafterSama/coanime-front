import { Article } from '../articles/article.types';
import { User } from '../users/user.types';

export interface TitleImage {
  id: number;
  titleId: number;
  name: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface TitleType {
  id: number;
  name: string;
  slug: string;
  createdAt: string | null;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  pivot?: {
    titleId: number;
    genreId: number;
  };
  [key: string]: unknown;
}

export interface Title {
  broadFinish: string | null;
  broadTime: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  editedBy: number | null;
  episodies: number | null;
  genres: Genre[];
  id: number;
  images: { id: number; titleId: number; name: string | null };
  justYear: string | boolean | null;
  name: string;
  otherTitles: string;
  pivot: { postId: number; titleId: number };
  posts: Article[];
  publicTime: string | null;
  ratingId: number;
  sinopsis: string;
  slug: string;
  status: string;
  trailerUrl: string | null;
  type: { id: number; name: string; slug: string };
  typeId: number;
  updatedAt: string | null;
  userId: number;
  users: User;
}
