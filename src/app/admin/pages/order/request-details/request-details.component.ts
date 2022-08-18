import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { ProductStatus } from 'src/app/enum/product-status';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { AdminService } from 'src/app/services/admin.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreateInvoiceReturnComponent } from './create-invoice-return/create-invoice-return.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';


@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  selectedIds: number[] = [];
  dataForm:FormGroup
  id: any;
  order: Order;
  products: any[] = [];
  invoices: any[] = [];
  countInvoice: number;
  clickActive: any[]=[];
admin
  //subscription
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  //Enum
  public productEnum = ProductStatus;

  productOrderStatus: Select[] = [
    {value: ProductOrderStatus.PENDING, viewValue: 'Pending'},
    {value: ProductOrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: ProductOrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: ProductOrderStatus.PURCHASED, viewValue: 'Purchased'},
    {value: ProductOrderStatus.PARTIAL_PURCHASED, viewValue: 'Partial Purchased'},
    {value: ProductOrderStatus.SEND_TO_BD, viewValue: 'Send to BD'},
    {value: ProductOrderStatus.PARTIAL_SEND_TO_BD, viewValue: 'Partial Send to BD'},
    {value: ProductOrderStatus.INVOICED, viewValue: 'Invoiced'},
    {value: ProductOrderStatus.PARTIAL_INVOICED, viewValue: 'Partial Invoiced'},
    {value: ProductOrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: ProductOrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: ProductOrderStatus.PARTIAL_DELIVERED, viewValue: 'Partial Delivered'},
    {value: ProductOrderStatus.RETURN, viewValue: 'Return'},
    {value: ProductOrderStatus.PARTIAL_RETURN, viewValue: 'Partial Return'}
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public invoiceService: InvoiceService,
    private dialog: MatDialog,
    private uiService: UiService,
    private fb:FormBuilder,
    private adminService:AdminService,
    private utilsService:UtilsService,
    private reloadService: ReloadService,
  ) {}



  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderInfo();
      }
    });
    this.reloadService.refreshOrder$
    .subscribe(()=>{
      this.getOrderInfo();
    });
    this.clickActive[0]=true;
    this.initFormValue()
    this.getAdminData();
  }

  initFormValue(){
    this.dataForm=this.fb.group({
      selected:[null],
      comment:[null]
    })
  }

  // view child create invoice
  /*** Create Order Pop Up Controll */
  openDialog() {
    const dialogRef = this.dialog.open(CreateInvoiceComponent, {
      restoreFocus: false,
      data: {
        order: this.order,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  openReturn(){
    const dialogRe = this.dialog.open(CreateInvoiceReturnComponent, {
      restoreFocus: false,
      data: {
        order: this.order,
      }
    });
    dialogRe.afterClosed().subscribe(() => this.menuTrigger.focus());
  }
  /**
   * http req
   */
  getAdminData(){
    this.adminService.getAdminShortData()
    .subscribe(res=>{
      this.admin=res.data
    }, err => {
      console.log(err);
    })
  }
  getOrderInfo() {
    this.orderService.getrequestOrderDetails(this.id)
    .subscribe(
      (res) => {
        this.order = res.data;
        this.products = this.order.orderedItems.map( (m) => {
          return {
            ...m, ...{select: false}
          }
        });
        this.dataForm.get('selected').patchValue(this.order.deliveryStatus)
        this.getInvoiceCount();
    }, (err) => {
      console.log(err);
    }
    );
  }

  getInvoicesByOrderNo(){
    this.invoiceService.getAllInvoicesByOrderNo(this.order.orderId)
    .subscribe(res=> {
      this.invoices = res.data;
      this.countInvoice = res.data.length;
    }, err=> {
      console.log(err);

    })

    this.clickActive=[];
    this.clickActive[1]=true;


  }

  getInvoiceCount(){
    this.invoiceService.getAllInvoicesByOrderNo(this.order.orderId)
    .subscribe(res=> {
      this.countInvoice = res.data.length;
    }, err=> {
      console.log(err);

    })
  }

  getOrderDetails(){
    this.invoices = [];
    this.clickActive=[];
    this.clickActive[0]=true;
  }
  getReturns(){
    this.clickActive=[];
    this.clickActive[2]=true;
  }

  /**
   * NG CLASS
   */
  getStatusColor(product: Product) {
    switch (product.status) {
      case this.productEnum.DRAFT: {
        return 'draft';
      }
      case this.productEnum.ACTIVE: {
        return 'active';
      }
      case this.productEnum.INACTIVE: {
        return 'inactive';
      }
      case this.productEnum.ARCHIVED: {
        return 'archived';
      }
      case this.productEnum.STOCKOUT: {
        return 'stockout';
      }
      case this.productEnum.REORDER: {
        return 'reorder';
      }
      case this.productEnum.NONE: {
        return 'none';
      }
      default: {
        return '-';
      }
    }
  }
  onOrderStatusChange(){
    let dt0=new Date();
    let dt=this.utilsService.getCurrentDMY()
    let orderStatus={
      status: this.productOrderStatus[this.dataForm.value.selected].viewValue,
      adminInfo: this.admin.name,
      time: dt,
      dateTime: dt0
    }

    if(this.selectedIds.length === 0){
      this.uiService.warn("Please Select the items first");
      return
    }else{
      for(let i=0; i< this.selectedIds.length; i++){
        let iDx = this.selectedIds[i];
        this.order.orderedItems[iDx].status = this.dataForm.value.selected;
      }
    }
    this.selectedIds = [];
    this.order.deliveryStatus=this.dataForm.value.selected;
    this.order.orderStatusTimeline.push(orderStatus);
    this.orderService.updateRequestOrderById(this.order)
    .subscribe(res=>{
      this.reloadService.needRefreshOrder$();
    }, (err)=>{
      console.log(err);

    })
  }
  addNewComment(){
    this.order.comments.push(this.dataForm.value.comment)
    this.orderService.updateRequestOrderById(this.order)
    .subscribe(res=>{
      console.log(res.message);
    }, err => {
      console.log(err);
    })
  }
  /**
   * Calculation
   */

  calculateTotalTax() {
    let tax = 0;
    for (let i = 0; i < this.order?.orderedItems.length; i++) {
      tax += this.calculateTax(
        this.order.orderedItems[i].tax,
        this.order.orderedItems[i].quantity
      );
    }
    return tax;
  }

  calculateTax(tax, quantity): number {
    return tax * quantity;
  }

  onStatusChange(status, order, index){
    order.orderedItems[index].status = status;
    // call api
    this.orderService.updateOrderById(order)
    .subscribe(res => {
      this.uiService.success(res.message);
    })
  }

  onCheckChange(index:number) {
    const i = this.selectedIds.findIndex(f => f === index);
    if (i >= 0) {
      this.selectedIds.splice(i, 1);
    } else {
      this.selectedIds.push(index);
    }
  }

  getTotalQuantity(items){
    let sum=0;
    for(let i=0; i<items.length; i++){
      sum += items[i].quantity;
    }
    return sum;
  }

  getRoundValue(price, qty){
    if(qty){
      return Math.floor(price*qty);
    }else{
      return Math.floor(price);
    }
  }

}
