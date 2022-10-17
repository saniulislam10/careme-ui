import { OrderItem } from "./order";

export interface Return {
  _id?: string,
  invoiceId : string,
  returnId? : string,
  orderNumber: string,
  returnDate: Date,
  customerName: string,
  billingAddress: any,
  shippingAddress: string,
  adjustment: Number,
  deliveryFee: Number,
  deliveryStatus: Number,
  subTotal: Number,
  total: Number,
  products: OrderItem | any,
  refundEligible?: boolean,
  reason?: string,
  images?: string[],
}
