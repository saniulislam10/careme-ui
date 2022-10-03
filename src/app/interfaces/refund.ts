export interface Refund {
  _id?: string;
  refundId?: string,
  returnId: any,
  orderNumber: String,
  invoiceId: any,
  customerName?: string,
  products: any[],
  paymentBy: String,
  paymentOptions: String,
  phoneNo: String,
  createdAt?: any
}
