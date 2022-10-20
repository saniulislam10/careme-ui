import { Pipe, PipeTransform } from '@angular/core';
import { PaymentStatus } from 'src/app/enum/payment-status';

@Pipe({
  name: 'paymentStatus'
})
export class PaymentStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case PaymentStatus.PAID : {
        return 'Paid';
      }
      case PaymentStatus.UNPAID : {
        return 'Unpaid';
      }
      case PaymentStatus.PARTIALPAID : {
        return 'Partial Paid';
      }
      case PaymentStatus.PENDING : {
        return 'Unpaid';
      }
      case PaymentStatus.REFUNDED : {
        return 'Refunded';
      }
      case PaymentStatus.OVERDUE : {
        return 'Overdue';
      }
      case PaymentStatus.EXPIRED : {
        return 'Expired';
      }
      case PaymentStatus.CANCEL : {
        return 'Canceled';
      }
    }

  }

}
