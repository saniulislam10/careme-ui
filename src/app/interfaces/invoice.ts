import { OrderItem } from "./order";

export interface Invoice {
  _id?: string,
  invoiceId? : string,
  orderNumber: string,
  invoiceDate: Date,
  customerName: string,
  billingAddress: any,
  shippingAddress: string,
  subTotal: Number,
  total: Number,
  paidAmount: Number,
  deliveryStatus: Number,
  paymentStatus: Number,
  shippingCarrier: String,
  products: OrderItem | any
}
