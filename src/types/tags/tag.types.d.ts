export interface Tag {
  id: number;
  name: string;
  pivot: { postId: number; tagId: number };
  postId: number;
  tagId: number;
  slug: string;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}
