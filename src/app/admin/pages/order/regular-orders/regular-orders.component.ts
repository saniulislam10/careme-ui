import { ExportPopupComponent } from './export-popup/export-popup.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Pagination } from 'src/app/interfaces/pagination';
import { debounceTime, distinctUntilChanged, filter, pluck, switchMap } from 'rxjs/operators';
import { Order } from 'src/app/interfaces/order';
import { EMPTY, Subscription } from 'rxjs';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ExportType } from 'src/app/enum/exportType.enum';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { NgxSpinnerService } from 'ngx-spinner';
import { Select } from 'src/app/interfaces/select';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { CreateOrderDialogComponent } from './create-order-dialog/create-order-dialog.component';
@Component({
  selector: 'app-regular-orders',
  templateUrl: './regular-orders.component.html',
  styleUrls: ['./regular-orders.component.scss']
})
export class RegularOrdersComponent implements OnInit {
  @ViewChild('export') exportOrder:ExportPopupComponent;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  //date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // sort
  public sortQuery = {createdAt: -1};
  public activeSort = null;
  //subscription
  private subAcRoute: Subscription;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  orders: Order[];
  status: number=0;
  searchProducts: any[];
  products: any;
  holdPrevData: any;
  productService: any;
  searchOrders : Order[] = []
   // Pagination
   ordersPerPage = 10;
   currentPage = 1;
   totalOrders = 0;
   totalOrdersStore=0
   orderStatus: any;
   filter: any;

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
// Selected Data
selectedIds: string[] = [];
@ViewChild('matCheckbox') matCheckbox: MatCheckbox;
  constructor(
    private orderService: OrderService,
    private utilsService:UtilsService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
     // GET PAGE FROM QUERY PARAM
     this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.searchOrders.length) {
        this.getAllOrders();
      }
    });
    this.getAllOrders();
  }


  /**
   * FILTER DATA
   */

  filterByOrderStatus(data){
    this.filter = {deliveryStatus: data};
    this.getAllOrders();
  }

  filterByVendor(data){
    this.filter = {'orderedItems.vendor': data};
    this.getAllOrders();
  }

  filterByPaymentStatus(data: number){
    this.filter = {paymentStatus: data};
    this.getAllOrders();
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
        this.getAllOrders();
      }
    }
  }

  /**
   * SORTING
   */
   sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllOrders();
  }

  getAllOrders(){
    const pagination: Pagination = {
      pageSize: this.ordersPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllOrdersByAdmin(pagination, this.sortQuery, this.filter)

    .subscribe(res => {

      console.log("total regular order data",res.data)

      this.orders = res.data;
      if (this.orders && this.orders.length) {
        this.orders.forEach((m, i) => {
          const index = this.selectedIds.findIndex(f => f === m._id);
          this.orders[i].select = index !== -1;
        });
        this.checkSelectionData();
        this.holdPrevData = res.data;
        this.totalOrders = res.count;
        this.totalOrdersStore = res.count;
      }
    })
  }
  getAllOrdersByAdmin(){
    this.orderService.getAllOrdersByAdmin()
    .subscribe(res=>{
      // console.log(res.data);
    }, err=>{
      console.log(err);
    })
  }



  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data.trim();
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchOrders = [];
          this.query = null;
          this.getAllOrders();
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        const filter = {productVisibility: true};
        return this.orderService.getOrdersBySearch(data, pagination, filter);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.orders = res.data;
        this.searchOrders=res.data;
        if (this.searchOrders.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.isLoading = false;
      });
  }


  openDialog() {
    this.dialog.open(CreateOrderDialogComponent);
  }

  /*** Create Order Pop Up Controll */
  // createOrderPopUp(){
  //   this.createOrder.createOrderShow();
  // }
  /**** export pop up */
  exportPopUpShow(){
    this.exportOrder.exportPOpUpShow();
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchOrders.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }

  handleOpen(): void {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchOrders.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }
  exportToExcel(value){

    if(value.selectedAmount===ExportType.ALL_ORDERS){
      this.orderService.getAllOrdersByAdmin()
      .subscribe(res=>{
        this.exportData(res.data,value.SelectedType)
      }, err=>{
        console.log(err);
      })
      // exportToExcel(this.orders)
    }
    else if(value.selectedAmount === ExportType.CURRENT_PAGE){
      this.exportData(this.orders,value.SelectedType)
    }
    else if(value.selectedAmount === ExportType.SELECTED){
      //this.
      this.orderService.getSelectedOrderDetails(this.selectedIds)
      .subscribe(res=>{
        this.exportData(res.data,value.SelectedType)
      })
    }
    else if(value.selectedAmount === ExportType.BY_SEARCH_RESULT){
      this.exportData(this.orders,value.SelectedType)
    }
    else if(value.selectedAmount === ExportType.BY_DATE){

    }
  }
  exportData(orders,type){
    this.spinner.show();
    const date = this.utilsService.getDateString(new Date());
    // EXPORT XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'orders');
    if(type==="2"){

      XLSX.writeFile(wb, `Orders_${date}.csv`);
    }else{

    XLSX.writeFile(wb, `Orders_${date}.xlsx`);
    }
    this.spinner.hide();
  }
  /**
   * PAGINATION CHANGE
   */
   public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }
   /**
   * ON Select Check
   */

    onCheckChange(event: any, index: number, id: string) {
      if (event) {
        this.selectedIds.push(id);
      } else {
        const i = this.selectedIds.findIndex(f => f === id);
        this.selectedIds.splice(i, 1);
      }
    }

    onAllSelectChange(event: MatCheckboxChange) {
      const currentPageIds = this.orders.map(m => m._id);
      if (event.checked) {
        this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
        this.orders.forEach(m => {
          m.select = true;
        })
      } else {
        currentPageIds.forEach(m => {
          this.orders.find(f => f._id === m).select = false;
          const i = this.selectedIds.findIndex(f => f === m);
          this.selectedIds.splice(i, 1);
        })
      }
    }

    private checkSelectionData() {
      let isAllSelect = true;
      this.orders.forEach(m => {
        if (!m.select) {
          isAllSelect = false;
        }
      });

      this.matCheckbox.checked = isAllSelect;
    }


    getDeliveryStatus(data:any){
      const status = data?.status;
       if (status === 0) {
         return 'pending';
       } else if (status === 1) {
         return 'confirm';
       } else if (status === 2) {
         return 'processing';
       } else if (status === 3) {
         return 'shipping';
       } else if (status === 4) {
         return 'delivered';
       } else if (status === 5) {
         return 'cancle';
       } else if (status === 6) {
         return 'refund';
       } else {
         return 'pending';
       }
    }

    onFilterSelectChange(data) {
      this.status = data;
      switch (data) {
        case 1:
          this.filter = { paymentMethod: "Cash On Delivery" };
          this.getAllOrders()
          break;
        case 2:
          this.filter = { paymentStatus: 1 };
          this.getAllOrders()
          break;
        case 3:
          this.filter = { paymentStatus: 3 };
          this.getAllOrders()
          break;
        case 4:
          this.filter = { paymentStatus: 0 };
          this.getAllOrders()
          break;

        default:
        // code block
      }

      if (data) {
        this.query = { ...this.query, ...{ hasLink: false } };
       // this.getAllProducts();
      } else {
        delete this.query;
        //this.getAllProducts();
      }
    }
}

