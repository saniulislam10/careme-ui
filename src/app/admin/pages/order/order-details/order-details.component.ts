import { NzMessageService } from 'ng-zorro-antd/message';
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
import { Order, OrderItem } from 'src/app/interfaces/order';
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
import { Invoice } from 'src/app/interfaces/invoice';
import { Return } from 'src/app/interfaces/return';
import { ReturnService } from 'src/app/services/return.service';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  providers: [PricePipe],
})
export class OrderDetailsComponent implements OnInit {
  editVisible = false;
  showModal(): void {
    this.editVisible = true;
  }
  editOk(): void {
    this.editVisible = false;
  }
  editCancel(): void {
    this.editVisible = false;
  }

  invoices: Invoice[] = [];
  returns: Return[] = [];
  invoiceDisable: boolean = true;
  returnDisable: boolean = true;
  bodyTabs = [
    {
      name: 'Overview',
      disabled: false,
    },
    {
      name: 'Invoice',
      disabled: this.invoiceDisable,
    },
    {
      name: 'Return',
      disabled: this.returnDisable,
    },
  ];
  allSelected = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  dataForm: FormGroup;
  id: any;
  order: Order;
  products: any[] = [];
  countInvoice: number;
  clickActive: any[] = [];
  admin: any;
  commentEmpty: string = '';
  // calculation
  total = 0;
  spin: boolean = false;
  inputValue: string = null;

  selectedDiv: boolean = false;
  // Pagination
  ordersPerPage = 10;
  currentPage = 1;
  totalOrders = 0;
  totalOrdersStore = 0;
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
    { value: ProductOrderStatus.PENDING, label: 'Pending' },
    { value: ProductOrderStatus.CANCEL, label: 'Cancel' },
    { value: ProductOrderStatus.CONFIRM, label: 'Confirm' },
    {
      value: ProductOrderStatus.PARTIAL_SHIPPING,
      label: 'Partial Shipping',
      disabled: true,
    },
    { value: ProductOrderStatus.SHIPPING, label: 'Shipping', disabled: true },
  ];
  selectedIds: number[] = [];
  timelineStatus: any[];
  vProducts: any[];
  success: boolean = true;

  constructor(
    private pricePipe: PricePipe,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    public invoiceService: InvoiceService,
    public returnService: ReturnService,
    private dialog: MatDialog,
    private uiService: UiService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private utilsService: UtilsService,
    private productService: ProductService,
    private reloadService: ReloadService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private msg: NzMessageService
  ) {}

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

  getDisable(tab) {
    if (tab.name === 'Invoice') {
      return this.invoiceDisable;
    }
    if (tab.name === 'Return') {
      return this.returnDisable;
    }
  }

  getInvoicesByOrderId(id) {
    this.invoiceService.getAllInvoicesByOrderNo(id).subscribe(
      (res) => {
        this.invoices = res.data;
        if (this.invoices.length > 0) {
          this.invoiceDisable = false;
        } else {
          this.invoiceDisable = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  getReturnsByOrderId(id) {
    this.returnService.getAllReturnsByOrderNo(id).subscribe(
      (res) => {
        console.log('Returns', res.data);
        this.returns = res.data;
        if (this.returns.length) {
          this.returnDisable = false;
        } else {
          this.returnDisable = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onRefresh() {
    this.spin = true;
    this.products = [];
    this.setOfCheckedId.clear();
    this.getOrderInfo(this.id);
    this.getAllOrders();
  }

  initFormValue() {
    this.dataForm = this.fb.group({
      // selected: [null],
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
    if (this.selectedIds.length === 0) {
      this.msg.create('warning', 'Please select an item to create invoice');
      return;
    }
    const dialogRef = this.dialog.open(CreateInvoiceComponent, {
      restoreFocus: false,
      data: {
        order: this.order,

        canceledOrderSku: this.getCancelSKU(),
        canceledOrderAmount: this.calculateCancelTotal(),
        selectedIds: this.selectedIds,
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.onRefresh();
      this.menuTrigger.focus();
    });
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
    this.router.navigate(['../../edit-order']);
  }

  showOrderDetails(id, i) {
    this.selectedDiv[i] = true;
    console.log('data', id);
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
    });
  }

  getOrderInfo(id: any) {
    this.orderService.getOrderDetails(id).subscribe(
      (res) => {
        this.order = res.data;
        this.getInvoicesByOrderId(this.order.orderId);
        this.getReturnsByOrderId(this.order.orderId);
        this.selectedIds = [];

        this.order.orderedItems.forEach((element) => {
          element.previousStatus = element.status;
        });

        this.timelineStatus = this.order.orderStatusTimeline;
        //console.log('order order', this.order);

        this.products = this.order.orderedItems;
        console.log(this.products);

        this.vProducts = this.arrayGroupByField(this.products, 'vendorName');

        this.getInvoiceCount();
      },
      (err) => {
        console.log(err);
      }
    );
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
        select: false,
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

  //thumbnail
  tabs: (
    | { name: string; disabled: boolean }
    | { name: string; disabled: boolean }
    | { name: string; disabled: boolean }
  )[];
  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
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
      currentPage: this.currentPage.toString(),
    };
    this.orderService
      .getAllOrdersByAdmin(pagination, this.sortQuery, this.filter)
      .subscribe(
        (res) => {
          this.orders = res.data;
          this.spin = false;
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
      case ProductOrderStatus.SHIPPING: {
        return 'shipping';
      }
      case ProductOrderStatus.PARTIAL_SHIPPING: {
        return 'shipping';
      }
      case ProductOrderStatus.DELIVERED: {
        return 'delivered';
      }
      case ProductOrderStatus.PARTIAL_DELIVERED: {
        return 'delivered';
      }
      case ProductOrderStatus.PARTIAL_RETURN: {
        return 'refund';
      }
      case ProductOrderStatus.RETURN: {
        return 'refund';
      }

      default: {
        return '-';
      }
    }
  }

  addNewComment() {
    this.order.comments.push({
      text: this.inputValue,
      date: new Date(),
      name: this.admin.name,
    });
    this.orderService.updateOrderById(this.order).subscribe(
      (res) => {
        console.log(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
    this.inputValue = null;
  }
  /**
   * Calculation
   */
  calculateCancelTotal() {
    let total = 0;
    this.order?.orderedItems.forEach((f) => {
      if (f.status === 1) {
        total += f.price + f.tax;
        // total += ((f.price + f.tax) - f.advanceAmount)
      }
    });
    return total;
  }

  getCancelSKU() {
    let sku = [];
    this.order?.orderedItems.forEach((f) => {
      if (f.status === 1) {
        sku.push(f.sku);
      }
    });
    return sku.join(',');
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

  get calculateSubTotal() {
    let subTotal: number = 0;
    for (let i = 0; i < this.order?.orderedItems?.length; i++) {
      subTotal += this.getAmount(this.order?.orderedItems[i]);
    }
    return subTotal;
  }

  get calculateTotal() {
    return this.calculateSubTotal + this.calculateTotalTax();
  }

  onStatusChange(currentStatus, previousStatus, order, data: OrderItem) {
    data.deliveryStatus = currentStatus;

    if (currentStatus === ProductOrderStatus.CANCEL) {
      this.decreaseCommitted(data, data.productId._id);
      this.increaseAvailable(data, data.productId._id);
    } else if (
      previousStatus === ProductOrderStatus.CANCEL &&
      currentStatus === ProductOrderStatus.CONFIRM
    ) {
      this.increaseCommitted(data, data.productId._id);
      this.decreaseAvailable(data, data.productId._id);
    } else if (
      previousStatus === ProductOrderStatus.CANCEL &&
      currentStatus === ProductOrderStatus.PENDING
    ) {
      this.increaseCommitted(data, data.productId._id);
      this.decreaseAvailable(data, data.productId._id);
    }

    if (this.success) {
      this.updateOrder(order);
    }
  }

  decreaseCommitted(data, id) {
    this.productService.decreaseCommitedProductQuantity(data, id).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        this.msg.error(err.message);
        this.success = false;
      }
    );
  }
  increaseCommitted(data, id) {
    this.productService.increaseCommitedProductQuantity(data, id).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        this.msg.error(err.message);
        this.success = false;
      }
    );
  }
  decreaseAvailable(data, id) {
    this.productService.decreaseAvailableProductQuantity(data, id).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        this.msg.error(err.message);
        this.success = false;
      }
    );
  }
  increaseAvailable(data, id) {
    this.productService.increaseAvailableProductQuantity(data, id).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        this.msg.error(err.message);
        this.success = false;
      }
    );
  }

  updateOrder(order) {
    this.orderService.updateOrderById(order).subscribe(
      (res) => {
        this.msg.success(res.message);
      },
      (err) => {
        this.msg.error(err.message);
        return;
      }
    );
  }

  /**
   * ON Select Check
   */

  onAllCheck(event: any) {
    for (let i = 0; i < this.products.length; i++) {
      this.onCheckChange(event, i, this.products[i]._id);
      this.onAllChecked(event);
    }
    this.allSelected = !this.allSelected;
  }

  onCheckChange(event: any, index: number, id: any) {
    this.onItemChecked(id, event);
    if (event) {
      const i = this.selectedIds.findIndex((f) => f === index);
      if (i >= 0) {
        this.selectedIds.splice(i, 1);
      } else {
        this.selectedIds.push(index);
      }
    } else {
      const i = this.selectedIds.findIndex((f) => f === index);
      this.selectedIds.splice(i, 1);
    }

    console.log(this.selectedIds);
  }

  getAmount(item) {
    if (item.advanceAmount) {
      return Math.round(
        item?.price * item?.quantity + item.tax * item?.quantity
      );
    } else {
      return Math.round(
        item?.price * item?.quantity + item.tax * item?.quantity
      );
    }
  }

  orderSubTotal() {
    let total: number = 0;
    this.order?.orderedItems.forEach((f) => {
      if (f.advanceAmount) {
        total =
          total +
          Math.round(
            f?.price * f?.quantity + f.tax * f?.quantity - f.advanceAmount
          );
      } else {
        total =
          total + Math.round(f?.price * f?.quantity + f.tax * f?.quantity);
      }
    });
    return Math.round(total);
  }

  // Mamun
  updateCheckedSet(id: any, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.allSelected = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.allSelected;
  }

  getReturnPercentage(userData) {
    return 10;
  }
}
