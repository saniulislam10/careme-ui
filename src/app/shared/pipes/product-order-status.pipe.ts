import { Pipe, PipeTransform } from '@angular/core';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import {OrderStatus} from '../../enum/order-status';

@Pipe({
  name: 'productOrderStatus'
})
export class ProductOrderStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case ProductOrderStatus.PENDING: {
        return 'PENDING';
      }
      case ProductOrderStatus.CONFIRM: {
        return 'CONFIRM';
      }
      case ProductOrderStatus.DELIVERED: {
        return 'DELIVERED';
      }
      case ProductOrderStatus.CANCEL: {
        return 'CANCEL';
      }
      case ProductOrderStatus.PURCHASED: {
        return 'PURCHASED';
      }
      case ProductOrderStatus.PARTIAL_PURCHASED: {
        return 'PARTIAL PURCHASED';
      }
      case ProductOrderStatus.SEND_TO_BD: {
        return 'SEND TO BD';
      }
      case ProductOrderStatus.PARTIAL_SEND_TO_BD: {
        return 'PARTIAL SEND TO BD';
      }
      case ProductOrderStatus.INVOICED: {
        return 'INVOICED';
      }
      case ProductOrderStatus.PARTIAL_INVOICED: {
        return 'PARTIAL INVOICED';
      }
      case ProductOrderStatus.PARTIAL_DELIVERED: {
        return 'PARTIAL DELIVERED';
      }
      case ProductOrderStatus.PARTIAL_RETURN: {
        return 'PARTIAL RETURN';
      }
      case ProductOrderStatus.RETURN: {
        return 'RETURN';
      }
      case ProductOrderStatus.SHIPPING: {
        return 'SHIPPING';
      }
      default: {
        return '-';
      }
    }

  }

}
