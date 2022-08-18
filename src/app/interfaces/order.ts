import {User} from './user';
import {Product} from './product';
import { OrderTimelineComponent } from '../pages/user/account/order-timeline/order-timeline.component';
import { ProductOrderStatus } from '../enum/product-order-status';

export interface OrderItem {
  product?: string | Product;
  deletedProduct?: any;
  deleteDeliveryStatus?: string;
  price?: number;
  tax?: number;
  discountType?: number;
  discountAmount?: number;
  quantity?: number;
  status?: number | ProductOrderStatus;
  orderType?: string;
  vendor?:string;
  variant?: string;
  image?: string;
}


export interface Order {
  comments?: string[];
  orderStatusTimeline?:any[],
  _id?: string;
  orderId?: string;
  checkoutDate?: Date;
  deliveryStatus: number;
  subTotal?: number;
  shippingFee?: number;
  discount?: number;
  redeemAmount?: number;
  paidAmount?: number;
  totalAmount?: number;
  totalAmountWithDiscount?: number;
  deletedProduct?: boolean;
  refundAmount?: number;
  paymentMethod?: string;
  user?: any;
  name: string;
  phoneNo: string;
  email: string;
  alternativePhoneNo?: string;
  city: string;
  area: string;
  postCode: string;
  shippingAddress: string | any;
  couponId?: string | any;
  couponValue?: number;
  orderTimeline?: OrderTimeline;
  hasPreorderItem?: boolean;
  orderedItems: any[];
  orderNotes?: string;
  sessionkey?: string;
  smsTemp?: object;
  select?: boolean;
  paymentStatus?: any;
  statusNote?: string;
  vendors?:string[];
  images?: string[];
}

export interface OrderTimeline {
  others: boolean;
  othersData: Date;
  orderPlaced: boolean;
  orderPlacedDate: Date;
  orderProcessing: boolean;
  orderProcessingDate: Date;
  orderPickedByDeliveryMan: boolean;
  orderPickedByDeliveryManDate: Date;
  orderDelivered: boolean;
  orderDeliveredDate: Date;
}


export interface OrderedItems {
  product?: string;
  price?: number;
  sku?: string;
  quantity?: number;
  tax?: number;
  status?: number;
  orderType?: string;
  variant?: string;
  advance?: number;
  discountType?: string;
  discountAmount?: number;
  vendorName?: string;
  deliveryDateTo?: Date;
  deliveryDateFrom?: Date;
}






/*




 */
