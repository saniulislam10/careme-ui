export interface ShippingMethod {
  _id?: any,
  name: String,
  customOpeningTime: Boolean,
  openingTimesArray?: OpeningTime[],
  productTypeInStock: Boolean,
  productTypePreOrder: Boolean,
  inStockDeliveryOption: String,
  inStockDeliveryCustomRange: Boolean,
  inStockDeliveryFrom?: number,
  inStockDeliveryTo?: number,
  inStockDeliveryTimesArray?: timeRange[],
  bufferTime?: number,
  preOrderDeliveryFrom?: number,
  preOrderDeliveryTo?: number,
  preOrderDeliveryCustomRange: Boolean,
  preOrderDeliveryTimesArray?: timeRange[],
  condition?: string;
  flatRate?: number;
  baseRate?: number;
  perKgRate?: number;

}

export interface OpeningTime {
  day: String,
  isOpen: String,
  timing: timeRange[],
}
export interface timeRange {
  startTime: String,
  endTime: String,
}
