import { Pipe, PipeTransform } from '@angular/core';
import {ProductStatus} from '../../enum/product-status';

@Pipe({
  name: 'productStatus'
})
export class ProductStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case ProductStatus.DRAFT : {
        return 'Draft';
      }
      case ProductStatus.ACTIVE : {
        return 'Active';
      }
      case ProductStatus.PREORDER : {
        return 'Preorder';
      }
      case ProductStatus.ARCHIVED : {
        return 'Archived';
      }
      case ProductStatus.STOCKOUT : {
        return 'Stockout';
      }
      case ProductStatus.REORDER : {
        return 'Reorder';
      }
      case ProductStatus.NONE : {
        return 'None';
      }
      default: {
        return '-';
      }
    }

  }

}
