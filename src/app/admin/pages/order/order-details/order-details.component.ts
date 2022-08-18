import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { ProductStatus } from 'src/app/enum/product-status';
import { Order } from 'src/app/interfaces/order';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { AdminService } from 'src/app/services/admin.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';
import { CreateOrderDialogComponent } from '../regular-orders/create-order-dialog/create-order-dialog.component';
import { CreateInvoiceReturnComponent } from './create-invoice-return/create-invoice-return.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { EditOrderComponent } from './edit-order/edit-order.component';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  providers: [PricePipe],
})
export class OrderDetailsComponent implements OnInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  dataForm: FormGroup;
  id: any;
  order: Order;
  products: any[] = [];
  invoices: any[] = [];
  countInvoice: number;
  clickActive: any[] = [];
  admin: any;
  commentEmpty: string = '';
  // calculation
  total = 0;

  selectedDiv: boolean = false;
  // Pagination
  ordersPerPage = 10;
  currentPage = 1;
  totalOrders = 0;
  totalOrdersStore = 0
  orderStatus: any;
  filter: any;
  // sort
  orders: any;
  public sortQuery = { createdAt: -1 };
  public activeSort = null;
  //subscription
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  //Enum
  public productEnum = ProductStatus;

  canceledOrderSku: string;
  canceledOrderAmount: number;

  productOrderStatus: Select[] = [
    { value: ProductOrderStatus.PENDING, viewValue: 'Pending' },
    { value: ProductOrderStatus.CANCEL, viewValue: 'Cancel' },
    { value: ProductOrderStatus.CONFIRM, viewValue: 'Confirm' },
    { value: ProductOrderStatus.PURCHASED, viewValue: 'Purchased' },
    { value: ProductOrderStatus.PARTIAL_PURCHASED, viewValue: 'Partial Purchased' },
    { value: ProductOrderStatus.SEND_TO_BD, viewValue: 'Send to BD' },
    { value: ProductOrderStatus.PARTIAL_SEND_TO_BD, viewValue: 'Partial Send to BD' },
    { value: ProductOrderStatus.INVOICED, viewValue: 'Invoiced' },
    { value: ProductOrderStatus.PARTIAL_INVOICED, viewValue: 'Partial Invoiced' },
    { value: ProductOrderStatus.SHIPPING, viewValue: 'Shipping' },
    { value: ProductOrderStatus.DELIVERED, viewValue: 'Delivered' },
    { value: ProductOrderStatus.PARTIAL_DELIVERED, viewValue: 'Partial Delivered' },
    { value: ProductOrderStatus.RETURN, viewValue: 'Return' },
    { value: ProductOrderStatus.PARTIAL_RETURN, viewValue: 'Partial Return' }
  ];
  selectedIds: number[] = [];
  timelineStatus: any[];

  constructor(
    private pricePipe: PricePipe,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public invoiceService: InvoiceService,
    private dialog: MatDialog,
    private uiService: UiService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private productService: ProductService,
    private reloadService: ReloadService,
    public router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderInfo(this.id);
      }
    });
    this.reloadService.refreshOrder$.subscribe(() => {
      this.getOrderInfo(this.id);
    });
    this.clickActive[0] = true;
    this.initFormValue();
    this.getAdminData();
    this.getAllOrders();
  }

  initFormValue() {
    this.dataForm = this.fb.group({
      selected: [null],
      comment: [null],
      statusNote: [null],
    });
  }

  openDialog2() {
    this.dialog.open(CreateOrderDialogComponent);
  }

  // view child create invoice
  /*** Create Order Pop Up Controll */
  openDialog() {
      const dialogRef = this.dialog.open(CreateInvoiceComponent, {
        restoreFocus: false,
        data: {
          order: this.order,
          canceledOrderSku: this.getCancelSKU(),
          canceledOrderAmount: this.calculateCancelTotal(),
          selectedIds: this.selectedIds,
        },
      });
      dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  openReturn() {
    const dialogRe = this.dialog.open(CreateInvoiceReturnComponent, {
      restoreFocus: false,
      data: {
        order: this.order,
      },
    });
    dialogRe.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  editOrder() {
    console.log();
    const dialogRef = this.dialog.open(EditOrderComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    this.router.navigate(['../../edit-order'])
  }

  showOrderDetails(id, i) {
    this.selectedDiv[i] = true
    console.log("data", id);
    this.spinner.show();
    this.getOrderInfo(id);
    this.spinner.hide();

  }
  /**
   * http req
   */
  getAdminData() {
    this.adminService.getAdminShortData().subscribe((res) => {
      this.admin = res.data;
      console.log('admin', this.admin);
    });
  }

  getOrderInfo(id: any) {
    this.orderService.getOrderDetails(id).subscribe(
      (res) => {
        this.order = res.data;

        this.order.orderedItems.forEach(element => {
          element.previousStatus = element.status
        });

        this.timelineStatus = this.order.orderStatusTimeline;
        //console.log('order order', this.order);

        this.products = this.order.orderedItems;
        //console.log("products", this.products);

        this.dataForm.get('selected').patchValue(this.order.deliveryStatus);
        this.getInvoiceCount();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //thumbnail
  setThumbnailImage(data) {
    let images = this.getImages(data.medias, data.images);
    return images[0];
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias && medias.length > 0) {
      for (let i = 0, x = 0; i < medias.length; i++) {
        if (medias[i] !== null && medias[i] !== '') {
          allMedias.push(medias[i]);
          x++;
        }
      }
      allMedias = [...allMedias, ...images];
    } else {
      allMedias = images;
    }
    return allMedias;
  }

  getInvoicesByOrderNo() {
    this.invoiceService.getAllInvoicesByOrderNo(this.order.orderId).subscribe(
      (res) => {
        this.invoices = res.data;
        this.countInvoice = res.data.length;
      },
      (err) => {
        console.log(err);
      }
    );

    this.clickActive = [];
    this.clickActive[1] = true;
  }

  getInvoiceCount() {
    this.invoiceService.getAllInvoicesByOrderNo(this.order.orderId).subscribe(
      (res) => {
        this.countInvoice = res.data.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getOrderDetails() {
    this.invoices = [];
    this.clickActive = [];
    this.clickActive[0] = true;
  }

  getReturns() {
    this.clickActive = [];
    this.clickActive[2] = true;
  }

  /**
  * SORTING
  */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllOrders();
  }

  getAllOrders() {
    const pagination: Pagination = {
      pageSize: this.ordersPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.orderService.getAllOrdersByAdmin(pagination, this.sortQuery, this.filter)
      .subscribe(
        (res) => {
          this.orders = res.data;
          console.log("orders ", this.orders);

        },
        (err) => {
          console.log(err);
        }
      );
  }
  /**
   * NG CLASS
   */
  getStatusColor(status) {
    // console.log(status);

    switch (status) {
      case ProductOrderStatus.PENDING: {
        return 'pending';
      }
      case ProductOrderStatus.CONFIRM: {
        return 'confirm';
      }
      case ProductOrderStatus.DELIVERED: {
        return 'delivered';
      }
      case ProductOrderStatus.CANCEL: {
        return 'cancel';
      }
      case ProductOrderStatus.PURCHASED: {
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_PURCHASED: {
        return 'processing';
      }
      case ProductOrderStatus.SEND_TO_BD: {
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_SEND_TO_BD: {
        return 'processing';
      }
      case ProductOrderStatus.INVOICED: {
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_INVOICED: {
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_DELIVERED: {
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_RETURN: {
        return 'refund';
      }
      case ProductOrderStatus.RETURN: {
        return 'refund';
      }
      case ProductOrderStatus.SHIPPING: {
        return 'shipping';
      }

      default: {
        return '-';
      }
    }
  }
  onOrderStatusChange() {
    if (this.selectedIds.length === 0) {
      this.uiService.warn('Please Select the items first');
      return;

    } else {

      // this.onStatusChange(this.dataForm.value.selected, this.order);

      let dt0 = new Date();
      let dt = this.utilsService.getCurrentDMY();
      let sku = ""

      this.selectedIds.forEach((element) => {
        sku += (this.order.orderedItems[element].sku).toString()
      });

      this.selectedIds.forEach((element) => {
        this.order.orderedItems[element].status = this.dataForm.value.selected;
      });

      let orderStatus = {
        status: this.productOrderStatus[this.dataForm.value.selected].viewValue,
        adminInfo: this.admin.name,
        sku: sku,
        time: dt,
        dateTime: dt0,
        statusNote: this.dataForm.value.statusNote,
      };

      this.order.deliveryStatus = this.dataForm.value.selected;
      this.order.statusNote = this.dataForm.value.statusNote;
      this.order.orderStatusTimeline.push(orderStatus);

      this.orderService.updateOrderById(this.order).subscribe(
        (res) => {
          this.selectedIds.forEach(f => {
            let tempQuantity = 0;
            if (this.order.orderedItems[f].previousStatus == 1 && this.order.orderedItems[f].status != 1) {
              tempQuantity = -this.order.orderedItems[f].quantity
            } else if (this.order.orderedItems[f].previousStatus != 1 && this.order.orderedItems[f].status == 1) {
              tempQuantity = this.order.orderedItems[f].quantity
            } else {
              tempQuantity = 0
            }
            this.order.orderedItems[f].tempQuantity = tempQuantity
            this.productService
              .updateProductQuantityById(this.order.orderedItems[f])
              .subscribe(
                (res) => {
                  this.getOrderInfo(this.order._id)
                },
                (err) => {
                  console.log(err);
                }
              );
          });

          this.selectedIds.splice(0,this.selectedIds.length)
          this.uiService.success(res.message);
        },
        (err) => {
          console.log(err);
        }
      );
      // this.spinner.show();
    }
  }

  addNewComment() {
    this.order.comments.push(this.dataForm.value.comment);
    this.orderService.updateOrderById(this.order).subscribe(
      (res) => {
        console.log(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
    this.commentEmpty = null;
  }
  /**
   * Calculation
   */
  calculateCancelTotal() {
    let total = 0;
    this.order?.orderedItems.forEach((f) => {
      if(f.status === 1){
        total += ((f.price + f.tax))
        // total += ((f.price + f.tax) - f.advance)

      }
    })
    return total
  }

  getCancelSKU() {
    let sku = [];
    this.order?.orderedItems.forEach((f) => {
      if (f.status === 1) {
        sku.push(f.sku);
      }
    })
    return sku.join(',')
  }

  calculateTotalTax() {
    let tax = 0;
    for (let i = 0; i < this.order?.orderedItems?.length; i++) {
      tax += this.calculateTax(
        this.order?.orderedItems[i].tax,
        this.order?.orderedItems[i].quantity
      );
    }
    return tax;
  }

  calculateTax(tax, quantity): number {
    return tax * quantity;
  }

  calculateSubTotal() {
    this.total = 0;
    for (let i = 0; i < this.order?.orderedItems?.length; i++) {
      this.total +=
        this.order?.orderedItems[i].price *
        this.order?.orderedItems[i].quantity;
    }
    return this.total;
  }

  get calculateTotal() {
    return (
      this.calculateSubTotal() +
      this.calculateTotalTax() -
      this.order.redeemAmount
    );
  }


  onStatusChange(status, order) {

    if (status === 1 || status === 12) {
      this.selectedIds.forEach(element => {
        this.productService
          .updateProductQuantityById(order.orderedItems[element])
          .subscribe(
            (res) => {
              console.log(res.message);
            },
            (err) => {
              console.log(err);
            }
          );
      });
    }

    this.selectedIds.forEach((element) => {
      order.orderedItems[element].status = status;
    });


    // call api
    this.orderService.updateOrderById(order).subscribe(
      (res) => {
        this.uiService.success(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * ON Select Check
   */

  onCheckChange(event: MatCheckboxChange,index: number) {

    if (event.checked) {
      const i = this.selectedIds.findIndex((f) => f === index);
      if (i >= 0) {
        this.selectedIds.splice(i, 1);
      } else {
        this.selectedIds.push(index);
      }
    } else {
      this.selectedIds.splice(index, 1);
    }



  }

  getAmount(item) {
    if (item.advance) {
      // return Math.round((item?.price * item?.quantity + item.tax * item?.quantity) - item.advance);
      return Math.round((item?.price * item?.quantity + item.tax * item?.quantity));
    } else {
      return Math.round(item?.price * item?.quantity + item.tax * item?.quantity);
    }
  }

  orderSubTotal() {
    let total = 0;
    this.order?.orderedItems.forEach((f) => {
      if (f.advance) {
        total += Math.round((f?.price * f?.quantity + f.tax * f?.quantity) - f.advance)
      } else {
        total += Math.round(f?.price * f?.quantity + f.tax * f?.quantity)
      }
    })
    return Math.round(total);
  }
}
