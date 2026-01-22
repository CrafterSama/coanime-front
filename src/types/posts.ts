import { User } from './users';

export interface TagPivot {
  post_id: number;
  tag_id: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  pivot: TagPivot;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

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
