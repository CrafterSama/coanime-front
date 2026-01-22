import { Category } from '../categories/category.types';
import { Tag } from '../tags/tag.types';
import { User } from '../users/user.types';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  categoryId: number;
  image: string;
  viewCounter: number;
  userId: number;
  postponedTo: string;
  createdAt: string;
  updatedAt: string;
  approved: string;
  draft: number;
  postCreatedAt: string | null;
  tags: Tag[];
  categories: Category;
  users: User;
}
