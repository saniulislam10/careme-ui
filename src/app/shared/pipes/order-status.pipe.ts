import { Pipe, PipeTransform } from '@angular/core';
import {OrderStatus} from '../../enum/order-status';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case OrderStatus.PENDING : {
        return 'Pending';
      }
      case OrderStatus.CONFIRM : {
        return 'Confirm';
      }
      case OrderStatus.PROCESSING : {
        return 'Processing';
      }
      case OrderStatus.SHIPPING : {
        return 'Shipped';
      }
      case OrderStatus.DELIVERED : {
        return 'Delivered';
      }
      case OrderStatus.CANCEL : {
        return 'Cancel';
      }
      case OrderStatus.REFUND : {
        return 'Refund';
      }
      default: {
        return '-';
      }
    }

  }

}
