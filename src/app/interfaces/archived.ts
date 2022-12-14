import { Category } from "./category";

export interface Archived {
  _id: string;
  name?: string;
  slug?: string;
  sku?: string;
  status?: Number;
  costPrice?: number;
  wholeSalePrice?: number;
  sellingPrice?: number;
  discountType?: number;
  discountAmount?: number;
  quantity?: number;
  soldQuantity?: number;
  medias?: string[];
  images?: string[];
  shortDescription?: string;
  description?: string;
  ratingReview?: any[];
  discussion?: any[];
  createdAt?: Date;
  updatedAt?: Date;
  select?: boolean;
  totalRatings?: number;
  totalAnsweredQuestions?: number;
  brand: string;
  vendor?: string;
  canPartialPayment?: boolean;
  partialPaymentType?: number;
  partialPayment?: number;
  canRedeemPoints?: boolean;
  redeemPoints?: number;
  redeemPointsType?: number;
  earnPoints?: number;
  earnPointsType?: number;
  canEarnPoints?: boolean;
  variants?: any;
  options?: any;
  tax?: number;
  hasTax?: number;
  hasVariant?: boolean;
  variantFormArray?: any;
  parentCategory?:string|Category,
  variantDataArray?: any;
  ratings?: any;
  discountedPrice?: number;
  discount?: any;
  link?: any;
  hasLink?: any;

}
