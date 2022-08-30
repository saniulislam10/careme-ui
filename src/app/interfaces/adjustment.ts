export interface Adjustment {
  _id?: string;
  adjustmentId: string,
  dateTime: Date,
  products: any[],
  reason: number,
  status?:number,
}
