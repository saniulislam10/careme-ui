import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '../../interfaces/product';
import { AmountType } from 'src/app/enum/amount-type';
import { ProductBySearch } from 'src/app/interfaces/product-by-search';

@Pipe({
  name: 'requestCoin'
})
export class RequestCoinPipe implements PipeTransform {

  transform(product: ProductBySearch, type: string, quantity?: number, price?: number, rate?:number): number {

    if (product) {
      switch (type) {
        case 'request':{
          if (product.earnPointsType === AmountType.AMOUNT) {
            return product.earnPoints;
          } else if(product.earnPointsType === AmountType.PERCENTAGE) {
            let extra = product.weight * product.multyWeight;
            let mainPrice = (price * quantity * product.multyPrice)/rate;
            let priceTotal = mainPrice + extra;
            return Math.round((priceTotal * product.earnPoints) / 100);
          }
        }
        default: {
          return 0;
        }
      }
    } else {
      return 0;
    }

  }

}
