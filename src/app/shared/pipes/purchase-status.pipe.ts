import { PurchaseStatus } from 'src/app/enum/purchase-status';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'purchaseStatus'
})
export class PurchaseStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case PurchaseStatus.DRAFT : {
        return 'Draft';
      }
      case PurchaseStatus.CANCELED : {
        return 'Canceled';
      }
      case PurchaseStatus.PARTIAL_RECIEVED : {
        return 'PARTIAL';
      }
      case PurchaseStatus.CLOSED : {
        return 'CLOSED';
      }
      default: {
        return '-';
      }
    }

  }

}
