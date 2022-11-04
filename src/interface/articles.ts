import { Category } from './categories';
import { Tag } from './tags';
import { Title } from './titles';
import { User } from './users';

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  categoryId: number;
  postponedTo: string;
  approved: string;
  userId: number;
  editedBy: number;
  video: string | null;
  draft: string | number;
  viewCounter: number;
  postCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  categories: Category;
  tags: Tag[];
  titles: Title[];
  users: User;
}
