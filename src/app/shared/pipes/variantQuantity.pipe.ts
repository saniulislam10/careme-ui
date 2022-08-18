import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'variantQuantity',
})
export class VariantQuantityPipe implements PipeTransform {
  transform(quantity?: number, data?: any, variantQuantity?:number): number {
    if (data) {
      if (variantQuantity >=0) {
        return variantQuantity;
      } else {
        return quantity > 0 ? quantity : 0;
      }
    } else {
      return 0;
    }
  }
}
