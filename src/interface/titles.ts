import { Article } from './articles';
import { User } from './users';

export interface Title {
  broadFinish: string | null;
  broadTime: string | null;
  coverImageUrl?: string | null;
  cover_image_url?: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  editedBy: number | null;
  episodies: number | null;
  genres: any[];
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
