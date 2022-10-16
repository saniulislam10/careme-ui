import { OrderItem } from "./order";

export interface Invoice {
  _id?: string,
  invoiceId? : string,
  orderNumber: string,
  invoiceDate: Date,
  customerName: string,
  phoneNo?: string,
  email?: string,
  billingAddress?: any,
  shippingAddress: string,
  shippingStatus: number,
  subTotal: number,
  total: number,
  paidAmount: number,
  deliveryStatus: number,
  paymentStatus: number,
  shippingCarrier: String,
  deliveryFee: number,
  adjustment: number,
  products: OrderItem | any,
}
