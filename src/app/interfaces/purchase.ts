import { purchaseTimeline } from "./purchase-timeline";


export interface Purchase {
  _id?: string;
  reference: string;
  purchaseId?: string;
  dateTime: Date,
  supplier: String,
  manufacturer: String,
  supplier_link: String,
  supplier_reference: String
  products: any[],
  purchaseShippingCharge: number,
  adjustmentPrice: number,
  subTotal: number,
  totalAmount: number,
  status?:number,
  recieved?:number,
  select?:boolean,
  comments?: string[] | any;
  timeline?: purchaseTimeline[] | any;
}
