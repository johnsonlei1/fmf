export interface Restaurant {
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  stars: number;
  review_count: number;
  categories: string;
  hours?: string;
}
