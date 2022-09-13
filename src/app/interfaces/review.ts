export interface Review {
  _id?: string;
  user?: string;
  product?: string;
  rating?: number;
  sku?: string;
  order?: string;
  message: string;
}
