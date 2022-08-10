export interface Posts {
  id: number;
  categoryId: any;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: any[];
  postponedTo: any;
  titleId: number;
}
