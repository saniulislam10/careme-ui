
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { Pagination } from 'src/app/interfaces/pagination';
import { Select } from 'src/app/interfaces/select';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-all-invoice',
  templateUrl: './all-invoice.component.html',
  styleUrls: ['./all-invoice.component.scss']
})
export class AllInvoiceComponent implements OnInit {


  invoices: any;
  currentPage = 1;
  invoicePerPage = 10;
  //date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  filter: any;
  // sort
  public sortQuery = {createdAt: -1};
  public activeSort = null;

  //subscription
  private subAcRoute: Subscription;
  searchInvoices : any[] = [];

  productOrderStatus: Select[] = [
    {value: OrderStatus.PENDING, viewValue: 'Pending'},
    {value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: OrderStatus.PROCESSING, viewValue: 'Processing'},
    {value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: OrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: OrderStatus.REFUND, viewValue: 'Refund'}
  ];

  paymentOrderStatus: Select[] = [
    {value: PaymentStatus.PAID, viewValue: 'Paid'},
    {value: PaymentStatus.UNPAID, viewValue: 'Unpaid'},
    {value: PaymentStatus.PENDING, viewValue: 'Pending'},
    {value: PaymentStatus.PARTIALPAID, viewValue: 'Partial Paid'},
    {value: PaymentStatus.REFUNDED, viewValue: 'Refunded'},
    {value: PaymentStatus.OVERDUE, viewValue: 'Overdue'},
    {value: PaymentStatus.CANCEL, viewValue: 'Cancel'},
    {value: PaymentStatus.EXPIRED, viewValue: 'Expired'}
  ];

  constructor(
    private invoiceService: InvoiceService,
    private utilsService: UtilsService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.searchInvoices.length) {
        this.getAllInvoices();
      }
    });
    this.getAllInvoices();
  }
  getAllInvoices(){
    const pagination: Pagination = {
      pageSize: this.invoicePerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.invoiceService.getAllInvoices(pagination, this.sortQuery, this.filter)
    .subscribe(res => {
      this.invoices = res.data;
    }, err=>{
      console.log(err);
    })
  }

  /**
   * SORTING
   */
   sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllInvoices();
  }

  /**
   * FILTER DATA
   */

   filterByOrderStatus(data){
    this.filter = {deliveryStatus: data};
    this.getAllInvoices();
  }

  filterByPaymentStatus(data: number){
    this.filter = {paymentStatus: data};
    this.getAllInvoices();
  }

  /**
   * PAGINATION CHANGE
   */
   public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(this.dataFormDateRange.value.start);
      const endDate = this.utilsService.getDateString(this.dataFormDateRange.value.end);
      const qData = {createdAt: {$gte: startDate, $lte: endDate}};
      this.filter = qData;

      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getAllInvoices();
      }
    }
  }


}
