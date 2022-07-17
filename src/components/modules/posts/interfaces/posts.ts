export interface Posts {
  id: number;
  category_id: string | number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  postponed_to: string;
}
