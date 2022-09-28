export interface Refund {
  _id?: string;
  refundId?: string,
  returnId: any,
  orderNumber: string,
  invoiceId: any,
  customerName?: string,
  products: [],
  paymentBy: String,
  paymentOptions: String,
  phoneNo: String,
}
