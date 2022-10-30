export interface ShippingMethod {
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
