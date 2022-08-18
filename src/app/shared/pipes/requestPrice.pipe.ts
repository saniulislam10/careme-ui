import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product';
import { DiscountTypeEnum } from '../../enum/discount-type.enum';
import { AmountType } from 'src/app/enum/amount-type';

@Pipe({
  name: 'requestPrice',
})
export class RequestPricePipe implements PipeTransform {
  transform(price: any, quantity?: number, data?: any, rate?: number): number {
    if (price) {
      if (data?.hasLink) {
        let extra = data.weight * data.multyWeight * quantity;
        let mainPrice = (Math.round(price) * quantity * data.multyPrice)/rate;
        let priceTotal = mainPrice + extra;
        return Math.floor(priceTotal);
      } else {
        return Math.floor(price * quantity);
      }
    } else {
      return 0;
    }
  }
}
