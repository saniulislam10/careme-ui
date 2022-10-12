export interface OrderItem {
  productId: any,
  name: string,
  slug: string,
  price: number,
  image: string,
  sku: string,
  quantity: number,
  tax: number,
  vendorId: string | any,
  vendorName: string,
  brandId: string | any,
  brandName: string,
  productTypeId: string,
  productTypeName: string,
  orderType: string,
  variant: string,
  advanceType?: string,
  advanceAmount: number,
  deliveryStatus: number,
  deliveryDateFrom: Date,
  deliveryDateTo: Date,
  paymentStatus: number,
  paidAmount?: number,
  paymentMethod?: String,
  shippingFee?: number,
  returnPeriod: number,
  earnedAmount: number,
  invoicedQuantity: number,
  maxQty?: number,
  returnedQuantity: number,
  redeemedAmount: number,
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
  totalAmount: number,
  advanceTotal: number,
  shippingCharge: number,
  paidAmount: number,
  earnedPoints?: number,
  redeemedPoints?: number,
  canceledAmount: number,
  adjustmentAmount?: number,
  refundedAmount: number,
  paymentMethod?: string,
  userId: string | any,
  couponCode?: string,
  name: string,
  phoneNo: string,
  address: string,
  gender: string,
  email: string,
  shippingAddress: string,
  shippingPhoneNo: string,
  orderStatusTimeline: OrderStatusTimeline[],
  comments: any[],
  orderNotes: string,
  select?: any
}






/*




 */
