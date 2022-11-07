import { Cart } from 'src/app/interfaces/cart';
import { ShippingMethod } from 'src/app/interfaces/shipping-method';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipping',
})
export class ShippingPipe implements PipeTransform {
  transform(method: ShippingMethod, selectedZoneName: string, carts: Cart[]): number {
    if (method) {
      let shippingPrice = 0;
      let found = false;
      carts.forEach(m => {
        if (method.productEnable) {
          shippingPrice += 10;
          // break
        }
        if (method.catEnable) {
          method.catFormArray.forEach(cat => {
            if(!found){
              m.product.productType.forEach(element => {
                if (element === cat.category && !found) {
                  cat.catShipProfile.shippingZonesArray.forEach(x => {
                    if(!found){
                      x.zones.forEach(y => {
                        if (y.name === selectedZoneName) {
                          if (x.chooseRateType === 'flat') {
                            found = true;
                            shippingPrice += (x.flatRate * m.selectedQty);
                            console.log("Shipping Price ==== ", shippingPrice)
                          } else if (x.chooseRateType === 'weight') {
                            found = true;
                            shippingPrice += (x.baseRate + (x.perKgRate * Math.floor(m.product.weight * m.selectedQty)  ));
                            console.log("Shipping Price ==== ", shippingPrice)

                          }
                        }
                      });
                    }
                  });
                }
              })
            }
          });
          // break
        } if ( method.allProductEnable) {
          console.log(found);
          if(found){
            found = false;
          }else{
            method.allProductProfile.shippingZonesArray.forEach(x => {
              x.zones.forEach(y => {
                if (y.name === selectedZoneName) {
                  if (x.chooseRateType === 'flat') {
                    shippingPrice += x.flatRate * m.selectedQty;
                    console.log("Shipping Price ==== ", shippingPrice)
                  } else if (x.chooseRateType === 'weight') {
                    shippingPrice += (x.baseRate + (x.perKgRate * (Math.floor(m.product.weight * m.selectedQty))));
                    console.log("Shipping Price ==== ", shippingPrice)
                  }
                }
              });
            });
          }
        }
      })
      return shippingPrice
    } else {
      return 0
    }
  }
}
