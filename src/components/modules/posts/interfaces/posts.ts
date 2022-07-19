import { DateSchema } from 'yup';

export interface Posts {
  id: number;
  categoryId: any;
  title: string;
  excerpt: string;
  content: string;
  image: any;
  tags: any[];
  postponedTo: any;
}
