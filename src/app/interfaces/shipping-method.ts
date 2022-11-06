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
  allProductEnable?: Boolean;
  catEnable?: Boolean;
  productEnable?: Boolean;
  allProductProfile?: any;
  catFormArray?: any;

}

export interface OpeningTime {
  day: String,
  isOpen: String,
  timing: timeRange[],
}
export interface timeRange {
  startTime: Date,
  endTime: Date,
}
