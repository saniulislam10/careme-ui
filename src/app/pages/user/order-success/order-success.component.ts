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
import {Product} from '../../../interfaces/product';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {CoinPipe} from '../../../shared/pipes/coin.pipe';
import { UtilsService } from 'src/app/services/utils.service';
import { ThemePalette } from '@angular/material/core';

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

  @ViewChild('matCheckboxAdvancePay') matCheckboxAdvancePay: MatCheckbox;
  @ViewChild('matCheckboxFullPay') matCheckboxFullPay: MatCheckbox;
  @ViewChild('matCheckboxFullPay') matCheckboxSelectAll: MatCheckbox;


  isPaidAdvance: boolean = true;
  isPaidFull: boolean = false;

  totalAdvancePayment: number = 0;
  totalFullPayment: number = 120;

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
  ) {}

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
        this.checkAllByDefault();
        this.orderData.orderedItems.map((item) => {
          this.totalFullPayment += (item.price+item.tax) * item.quantity;
          if (item.advance > 0) {
            this.isAdvancePayment = true;
            this.totalAdvancePayment += item.advance;
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    if(!this.isAdvancePayment && !this.isPaidFull){
        this.uiService.warn('Please select a payment option');
    }
    else if(!this.isPaidAdvance && !this.isPaidFull){
      this.uiService.warn('Please select a payment option');
  }

    else if(this.isPaidFull){

      this.sessionStorage.storeDataToSessionStorage('amount',this.totalFullPayment.toString())
      this.sessionStorage.storeDataToSessionStorage('paymentStatus','0')
      this.router.navigate(['new-payment'], {queryParams: {orderId: this.id}});

    }else if(this.isPaidAdvance && !this.isPaidFull){

      this.sessionStorage.storeDataToSessionStorage('amount',this.totalAdvancePayment.toString())
      this.sessionStorage.storeDataToSessionStorage('paymentStatus','3')
      this.router.navigate(['new-payment'], {queryParams: {orderId: this.id}});

    }
  }

  onSelectAdvancePay(event: MatCheckboxChange) {

    if (event.checked) {
      this.isPaidAdvance=true
      this.matCheckboxFullPay.checked=false
      this.isPaidFull=false
    } else {
      this.isPaidAdvance=false
    }

  }

  onSelectFullPay(event: MatCheckboxChange) {

    if (event.checked) {
      this.isPaidFull=true
      this.matCheckboxAdvancePay.checked=false
      this.isPaidAdvance=false
    } else {
      this.isPaidFull=false
    }

  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.orderData.orderedItems.map((m) => m._id);
    this.allComplete = !this.allComplete;
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.orderData?.orderedItems.forEach((item) => {
        this.totalFullPayment += (item.price+item.tax) * item.quantity;
        this.totalAdvancePayment += item.advance * item.quantity;
        item.select = true;
      });
    } else {
      this.totalFullPayment = 120;
        this.totalAdvancePayment = 0;
      currentPageIds.forEach((m) => {
        this.orderData.orderedItems.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
    console.log(this.selectedIds);

  }

  checkAllByDefault(){
    console.log(this.orderData?.orderedItems?.length);

    for(let i=0; i< this.orderData.orderedItems.length; i++){
      this.selectedIds.push(this.orderData?.orderedItems[i]._id);
    }
    console.log(this.selectedIds);

  }

  onCheckChange(event: any, index: number, id: string) {
    console.log(id);

    let item = this.orderData.orderedItems[index];
    if (event.checked) {
      this.selectedIds.push(id);
      console.log(this.selectedIds);
      this.totalFullPayment += (item.price+item.tax) * item.quantity;
      this.totalAdvancePayment += item.advance * item.quantity;
    } else {
      this.totalFullPayment -= (item.price+item.tax) * item.quantity;
      this.totalAdvancePayment -= item.advance * item.quantity;
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
      console.log(this.selectedIds);
    }

  }
}
