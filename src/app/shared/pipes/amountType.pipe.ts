import { Pipe, PipeTransform } from '@angular/core';
import {AmountType} from '../../enum/amount-type';

@Pipe({
  name: 'amountType'
})
export class AmountTypePipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case AmountType.AMOUNT : {
        return 'Pts';
      }
      case AmountType.PERCENTAGE : {
        return '%';
      }
      default: {
        return '-';
      }
    }

  }

}
