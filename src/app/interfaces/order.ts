export interface OrderItem {
  productId: string | any,
  name: string,
  slug: string,
  price: Number,
  image: string,
  sku: string,
  quantity: Number,
  tax: Number,
  vendorId: string | any,
  vendorName: string,
  brandId: string | any,
  brandName: string,
  productTypeId: string,
  productTypeName: string,
  orderType: string,
  variant: string,
  advanceType?: string,
  advanceAmount: Number,
  deliveryStatus: Number,
  deliveryDateFrom: Date,
  deliveryDateTo: Date,
  paymentStatus: Number,
  paidAmount?: Number,
  paymentMethod?: String,
  shippingFee?: Number,
  returnPeriod: Number,
  earnedAmount: Number,
  invoicedQuantity: Number,
  returnedQuantity: Number,
  redeemedAmount: Number,
}
export interface OrderStatusTimeline {
  status:  string,
  adminInfo:string,
  dateTime: Date,
  statusNote: string,
  sku: string,
}


export interface Order {
  _id?: string;
  orderId?: string,
  checkoutDate: Date,
  orderedItems: OrderItem[] | any,
  subTotal: Number,
  advanceTotal: Number,
  shippingCharge: Number,
  paidAmount: Number,
  earnedPoints?: Number,
  redeemedPoints?: Number,
  canceledAmount: Number,
  refundedAmount: Number,
  paymentMethod?: string,
  userId: string | any,

  name: string,
  phoneNo: string,
  address: string,
  gender: string,
  email: string,
  shippingAddress: string,
  shippingPhoneNo: string,
  orderStatusTimeline: OrderStatusTimeline[],
  comments: string[],
  orderNotes: string,
  select?: any
}






/*




 */
