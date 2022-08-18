import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Pagination} from '../../../../interfaces/pagination';
import {NgxSpinnerService} from 'ngx-spinner';
import {PrescriptionOrderService} from '../../../../services/prescription-order.service';
import {Order} from '../../../../interfaces/order';
import {OrderService} from '../../../../services/order.service';
import {StorageService} from '../../../../services/storage.service';

@Component({
  selector: 'app-prescription-order-list',
  templateUrl: './prescription-order-list.component.html',
  styleUrls: ['./prescription-order-list.component.scss']
})
export class PrescriptionOrderListComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;
  private subData: Subscription;

  userOrder: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  tagActive = '0';
  sessionKey = 'ORDER_TAG_P';

  constructor(
    private prescriptionOrderService: PrescriptionOrderService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
  ) {
  }

  ngOnInit(): void {
    // Restore Session
    if (this.storageService.getDataFromSessionStorage(this.sessionKey)) {
      this.tagActive = this.storageService.getDataFromSessionStorage(this.sessionKey).tag;
    }
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (this.tagActive === '0') {
        this.getAllPrescriptionOrdersByUser();
      } else {
        this.getAllOrdersByUser();
      }
    });
  }

  private getAllPrescriptionOrdersByUser() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.prescriptionOrderService.getAllPrescriptionOrdersByUser(pagination)
      .subscribe(res => {
        this.spinner.hide();
        this.userOrder = res.data;
        this.totalProducts = res.count;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getAllOrdersByUser() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllOrdersByUser(pagination, null, '1')
      .subscribe(res => {
        this.spinner.hide();
        this.userOrder = res.data;
        this.totalProducts = res.count;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }



  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {

    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }

    if (this.subData) {
      this.subData.unsubscribe();
    }

  }

  /**
   * ON SELECT TAG
   */
  onSelectPending() {
    this.tagActive = '0';
    this.storageService.storeDataToSessionStorage(this.sessionKey, {tag: this.tagActive});
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllPrescriptionOrdersByUser();
    }
  }

  onSelectDone() {
    this.tagActive = '1';
    this.storageService.storeDataToSessionStorage(this.sessionKey, {tag: this.tagActive});
    if (this.currentPage > 1) {
      this.router.navigate([], {queryParams: {page: 1}});
    } else {
      this.getAllOrdersByUser();
    }
  }

}
