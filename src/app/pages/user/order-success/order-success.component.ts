import { Component, OnInit, ViewChild } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs/operators';
import { Order } from 'src/app/interfaces/order';
import { UiService } from 'src/app/services/ui.service';
import { StorageService } from 'src/app/services/storage.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { Product } from '../../../interfaces/product';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { CoinPipe } from '../../../shared/pipes/coin.pipe';
import { UtilsService } from 'src/app/services/utils.service';
import { ThemePalette } from '@angular/material/core';
import { PaymentStatus } from 'src/app/enum/payment-status';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss'],
  providers: [PricePipe, CoinPipe],
})
export class OrderSuccessComponent implements OnInit {

  allComplete: boolean = true;


  private subRouteOne?: Subscription;
  id: any;
  orderData: Order;
  isAdvancePayment: boolean = false;
  selectedIds: string[] = [];
  selectedSkus: string[] = [];

  @ViewChild('matCheckboxAdvancePay') matCheckboxAdvancePay: MatCheckbox;
  @ViewChild('matCheckboxFullPay') matCheckboxFullPay: MatCheckbox;
  @ViewChild('matCheckboxFullPay') matCheckboxSelectAll: MatCheckbox;


  isPaidAdvance: boolean = true;
  isPaidFull: boolean = false;

  totalAdvancePayment: number = 0;
  totalFullPayment: number = 0;
  shippingCharge: number = 120;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private sessionStorage: StorageService,
    private router: Router,
    private pricePipe: PricePipe,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getOrderItems();
      } else {
        console.log('Error');
      }
    });
  }
  private getOrderItems() {
    if (this.userService.getUserStatus()) {
      this.getOrderItemList();
    }
  }

  private arrayGroupByField<T>(
    dataArray: T[],
    field: string,
    firstId?: string
  ): any[] {
    const data = dataArray.reduce((group, product) => {
      const uniqueField = product[field];
      group[uniqueField] = group[uniqueField] ?? [];
      group[uniqueField].push(product);
      return group;
    }, {});

    const final = [];

    for (const key in data) {
      final.push({
        _id: key,
        data: data[key],
      });
    }

    if (firstId) {
      // Rearrange Index
      const fromIndex = final.findIndex((f) => f._id === firstId);
      const toIndex = 0;
      const element = final.splice(fromIndex, 1)[0];

      final.splice(toIndex, 0, element);

      return final as any[];
    } else {
      return final as any[];
    }
  }

  private getOrderItemList() {
    this.orderService.getAllOrdersByUserOrderId(this.id).subscribe(
      (res) => {
        console.log('this is from order-success, ', res.data[0]);
        this.orderData = res.data[0];
        this.checkAllByDefault(this.orderData);

      },
      (error) => {
        console.log(error);
      }
    );
  }

  checkAllByDefault(order) {
    order.orderedItems.map((item) => {
      if (item.paymentStatus === PaymentStatus.PENDING) {
        this.selectedIds.push(item._id);
        this.selectedSkus.push(item.sku);
        if (item.advanceAmount > 0) {
          this.isAdvancePayment = true;
          this.totalAdvancePayment += item.advanceAmount;
        }
        this.totalFullPayment += (item.price + item.tax) * item.quantity;
      } else if (item.paymentStatus === PaymentStatus.PARTIALPAID) {
        this.isPaidFull = true;
        this.totalFullPayment += ((item.price + item.tax) * item.quantity) - item.advanceAmount;
      }
    });
  }

  onSubmit() {
    if (!this.isAdvancePayment && !this.isPaidFull) {
      this.uiService.warn('Please select a payment option');
    }
    else if (!this.isPaidAdvance && !this.isPaidFull) {
      this.uiService.warn('Please select a payment option');
    }

    else if (this.isPaidFull) {

      this.sessionStorage.storeDataToSessionStorage('amount', this.totalFullPayment.toString())
      this.sessionStorage.storeDataToSessionStorage('paymentStatus', '0');
      this.sessionStorage.storeDataToSessionStorage('selectedSkus', this.selectedSkus);
      this.router.navigate(['new-payment'], { queryParams: { orderId: this.id, selectedSkus: this.selectedSkus } });

    } else if (this.isPaidAdvance && !this.isPaidFull) {

      this.sessionStorage.storeDataToSessionStorage('amount', this.totalAdvancePayment.toString())
      this.sessionStorage.storeDataToSessionStorage('paymentStatus', 3);
      this.sessionStorage.storeDataToSessionStorage('selectedSkus', this.selectedSkus);
      this.router.navigate(['new-payment'], { queryParams: { orderId: this.id, selectedSkus: this.selectedSkus } });

    }
  }

  onSelectAdvancePay(event: MatCheckboxChange) {

    if (event.checked) {
      this.isPaidAdvance = true
      this.matCheckboxFullPay.checked = false
      this.isPaidFull = false
    } else {
      this.isPaidAdvance = false
    }

  }

  onSelectFullPay(event: MatCheckboxChange) {

    if (event.checked) {
      this.isPaidFull = true
      this.matCheckboxAdvancePay.checked = false
      this.isPaidAdvance = false
    } else {
      this.isPaidFull = false
    }

  }

  onAllSelectChange(event: MatCheckboxChange) {
    this.selectedSkus = this.orderData.orderedItems.map((m) => m.sku);
    this.allComplete = !this.allComplete;
    if (event.checked) {
      this.totalFullPayment = 0;
      this.totalAdvancePayment = 0;
      this.orderData?.orderedItems.forEach((item) => {
        if (item.paymentStatus === PaymentStatus.PENDING) {
          if (item.advanceAmount > 0) {
            this.totalAdvancePayment += item.advanceAmount;
          }
          this.totalFullPayment += (item.price + item.tax) * item.quantity;
        } else if (item.paymentStatus === PaymentStatus.PARTIALPAID) {
          this.totalFullPayment += (item.price + item.tax) * item.quantity - item.advanceAmount;
        }
        item.select = true;
      });
    } else {
      this.totalFullPayment = 0;
      this.totalAdvancePayment = 0;
      this.selectedSkus = [];
    }
    console.log(this.selectedSkus);

  }



  onCheckChange(event: any, index: number, id: string, sku: string) {

    let item = this.orderData.orderedItems[index];
    if (event.checked) {
      this.selectedIds.push(id);
      this.selectedSkus.push(sku);
      if (item.paymentStatus === PaymentStatus.PENDING) {
        this.totalAdvancePayment += item.advanceAmount;
        this.totalFullPayment += (item.price + item.tax) * item.quantity;
      } else if (item.paymentStatus === PaymentStatus.PARTIALPAID) {
        this.totalFullPayment += (item.price + item.tax) * item.quantity - item.advanceAmount;
      }
    } else {
      if (item.paymentStatus === PaymentStatus.PENDING) {
        this.totalAdvancePayment -= item.advanceAmount;
        this.totalFullPayment -= (item.price + item.tax) * item.quantity;
      } else if (item.paymentStatus === PaymentStatus.PARTIALPAID) {
        this.totalFullPayment -= (item.price + item.tax) * item.quantity - item.advanceAmount;
      }
      const j = this.selectedSkus.findIndex((f) => f === sku);
      this.selectedSkus.splice(j, 1);
    }
    console.log(this.selectedSkus);

  }

  getTotalAdvance(items) {
    this.totalAdvancePayment += items.advanceAmount;
  }

}
