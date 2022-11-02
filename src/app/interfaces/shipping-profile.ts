import { ShippingMethod } from 'src/app/interfaces/shipping-method';
import { Zila } from 'src/app/interfaces/zila';
export interface ShippingProfile {
  _id?: any,
  name: String,
  shippingZonesArray: Zila[],


}
