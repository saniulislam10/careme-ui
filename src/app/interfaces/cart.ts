
import {Product} from './product';


export interface Cart {
  _id?: string;
  product?: any;
  image?: any;
  name?: string;
  price?: number;
  isSelected?: boolean;
  selectedQty: number;
  user?: string;
  variant?: Variant[];
  requestProduct?: boolean,
  link?: String,
  selectedGlobalVariants?: number,
  deliveryDateFrom?: any;
  deliveryDateTo?: any;
  variantName?: string;
  vendor?: any;
}
export interface Variant {
  variantVendorName?: any;
  variantQuantity?: number,
  variantReOrder?: number,
  variantContinueSelling?: string;
  variantStatus?: string;
  variantPrice?: number,
  image?: string;
  variantSku?: string;
}
