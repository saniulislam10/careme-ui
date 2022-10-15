import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { ProductStatus } from 'src/app/enum/product-status';
import { Order } from 'src/app/interfaces/order';
import { Pagination } from 'src/app/interfaces/pagination';
import { Purchase } from 'src/app/interfaces/purchase';
import { Select } from 'src/app/interfaces/select';
import { AdminService } from 'src/app/services/admin.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CreateNewPurchaseComponent } from '../create-new-purchase/create-new-purchase.component';
import { RecievedComponent } from '../recieved/recieved.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  dataForm: FormGroup;
  id: any;
  products: any[] = [];
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
  purchases: Purchase[] = [];
  purchase: Purchase;
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
    { value: ProductOrderStatus.PARTIAL_SHIPPING, viewValue: 'Partial Invoiced' },
    { value: ProductOrderStatus.SHIPPING, viewValue: 'Shipping' },
    { value: ProductOrderStatus.DELIVERED, viewValue: 'Delivered' },
    { value: ProductOrderStatus.PARTIAL_DELIVERED, viewValue: 'Partial Delivered' },
    { value: ProductOrderStatus.RETURN, viewValue: 'Return' },
    { value: ProductOrderStatus.PARTIAL_RETURN, viewValue: 'Partial Return' }
  ];
  selectedIds: number[] = [];
  timelineStatus: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
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
        this.getPurchaseInfo(this.id);
      }
    });
    this.reloadService.refreshPurchase$.subscribe(() => {
      this.getPurchaseInfo(this.id);
    });
    this.clickActive[0] = true;
    this.initFormValue();
    this.getAdminData();
    this.getAllPurchase();
  }

  initFormValue() {
    this.dataForm = this.fb.group({
      selected: [null],
      comment: [null],
      statusNote: [null],
    });
  }

  openDialog2() {
    const dialogRef = this.dialog.open(CreateNewPurchaseComponent, {
      restoreFocus: false,
      data: {
        order: {},
        canceledOrderSku: "sku001",
        canceledOrderAmount: "100tk",
        selectedIds: this.selectedIds,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
}

openRecieved(id, recieved, index, poQty){
  const dialogRef = this.dialog.open(RecievedComponent, {
    restoreFocus: false,
    data: {
      id: this.id,
      productId: id,
      index: index,
      purchaseQuantity: poQty,
      recieved: recieved,
    },
  });

  dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
}

  // view child create invoice
  /*** Create Order Pop Up Controll */

  editPurchase(id) {
    console.log();
    const dialogRef = this.dialog.open(CreateNewPurchaseComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    this.router.navigate(['../edit',id])
  }

  showPurchaseDetails(id, i) {
    this.selectedDiv[i] = true
    console.log("data", id);
    this.spinner.show();
    this.getPurchaseInfo(id);
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

  getPurchaseInfo(id: any) {
    this.purchaseService.getById(id).subscribe(
      (res) => {
        this.purchase = res.data;
        this.products = this.purchase.products;
        console.log(res.data);

      },
      (err) => {
        console.log(err);
      }
    );
  }

  //thumbnail
  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
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



  getPurchaseDetails() {
    this.clickActive = [];
    this.clickActive[0] = true;
  }

  Edit() {
    this.clickActive = [];
    this.clickActive[2] = true;
  }

  /**
  * SORTING
  */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllPurchase();
  }

  getAllPurchase() {
    const pagination: Pagination = {
      pageSize: this.ordersPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.purchaseService.getAll(pagination, this.filter)
      .subscribe(
        (res) => {
          this.purchases = res.data;
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
        return 'processing';
      }
      case ProductOrderStatus.PARTIAL_SHIPPING: {
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

  addNewComment() {
    this.purchase.comments.push(this.dataForm.value.comment);
    this.purchaseService.edit(this.purchase).subscribe(
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

  calculateTotalTax() {
    let tax = 0;
    for (let i = 0; i < this.purchase?.products?.length; i++) {
      tax += this.calculateTax(
        this.purchase.products[i].purchaseTax,
        this.purchase.products[i].purchaseQuantity
      );
    }
    return tax;
  }

  calculateTax(tax, quantity): number {
    return tax * quantity;
  }

  calculateSubTotal() {
    this.total = 0;
    for (let i = 0; i < this.purchase.products?.length; i++) {
      this.total +=
        this.purchase.products[i].price *
        this.purchase.products[i].quantity;
    }
    return this.total;
  }

  get calculateTotal() {
    return (
      this.calculateSubTotal() +
      this.calculateTotalTax()
    );
  }


  /**
   * ON Select Check
   */

  onCheckChange(event: MatCheckboxChange, index: number) {

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
    let purchasePrice = item?.purchasePrice;
    let tax = Math.round((purchasePrice * item?.purchaseTax)/100);
    let quantity = item?.purchaseQuantity;
    return Math.round((purchasePrice+tax)*quantity);
  }

  getRecievedAmount(item){
    let purchasePrice = item?.purchasePrice;
    let tax = Math.round((purchasePrice * item?.purchaseTax)/100);
    let quantity = item?.recieved ? item?.recieved : 0;
    return Math.round((purchasePrice+tax)*quantity);
  }


  orderSubTotal() {
    let total = 0;
    this.purchase.products.forEach((f) => {
        total += Math.round(f?.price * f?.quantity + f.tax * f?.quantity)
    })
    return Math.round(total);
  }
}
