import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ReloadService } from 'src/app/services/reload.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from 'src/app/services/ui.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import {
  pluck,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { EMPTY, Subscription } from 'rxjs';
import { Pagination } from 'src/app/interfaces/pagination';
import { ProductService } from 'src/app/services/product.service';
import { AdminService } from 'src/app/services/admin.service';
import { products } from '../../../../core/utils/dashboard.data';
import { timeStamp } from 'console';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {
  private subRouteOne?: Subscription;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  overlay = false;
  isFocused = false;
  isOpen = false;
  isLoading = false;
  query = null;
  searchProducts: Product[] = [];
  id: string = null;
  order: Order;
  orderAnother: Order;
  sku: any;
  variantSku: string;
  clickActive: any[] = [[]];
  products: any[] = [];
  holdProducts: any[] = [];
  admin: any;
  dataForm: FormGroup;
  isPermited: Boolean = true;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM

    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getOrderDetailsById();
      }
    });

    this.initFormModule();
    this.getAdminData();
  }

  initFormModule() {
    this.dataForm = this.fb.group({
      statusNote: [null],
    });
  }

  getAdminData() {
    this.adminService.getAdminShortData().subscribe((res) => {
      this.admin = res.data;
      console.log('admin', this.admin);
    });
  }

  getOrderDetailsById() {
    this.orderService.getOrderDetails(this.id).subscribe(
      (res) => {
        this.order = res.data;
        this.orderAnother = res.data;
        console.log('edit order details', this.order);

        this.products = this.order.orderedItems;

        this.products.forEach((item) => {
          item.product.variantFormArray.forEach((variant) => {
            if (item.sku === variant.variantSku) {
              item.maxQuantity = item.quantity + variant.variantQuantity;
              item.oldQuantity = item.quantity;
            }
          });
        });

        this.holdProducts = [...this.products];

        //console.log("holdProducts",this.holdProducts)
        this.patchVariant();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAmount(item) {
    return Math.round(item?.price * item?.quantity + item.tax * item?.quantity);
  }

  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  getOptions(option) {
    return option.split(',');
  }

  getVariantInfo(skuId) {
    // let array = this.product.variantFormArray;
    // this.selectedVariantData = array.find(
    //   ({ variantSku }) => variantSku === skuId
    // );
  }

  patchVariant() {
    for (let a = 0; a < this.order.orderedItems.length; a++) {
      this.clickActive[a] = [];
      let num = this.order.orderedItems[a].sku.split('-');
      console.log('patch variat fun', num[1]);
      for (let i = 0; i < num[1].length; i++) {
        this.clickActive[a][i] = Number(num[1][i]);
      }
      console.log('this.clickActive', this.clickActive);
    }
  }

  onSelectItem(data: Product): void {
    console.log('Selected Product Data', data);
    let product = {
      orderType: 'regular',
      price: data.sellingPrice,
      product: {
        images: data.images,
        medias: data.medias,
        name: data.name,
        options: data.options,
        sellingPrice: data.sellingPrice,
        sku: data.sku,
        slug: data.slug,
        status: data.status,
        variantDataArray: data.variantDataArray,
        variantFormArray: data.variantFormArray,
        variants: data.variants,
        vendor: data.vendor,
        _id: data._id,
      },

      quantity: 0,
      maxQuantity: 0,
      sku: data.sku,
      status: 0,
      tax: 0,
      delete: true,
      variantStatus: false,
    };

    console.log('Selected Product product', product);

    this.products.push(product);
    this.clickActive.push([]);
    this.handleCloseAndClear();
  }

  getVariantQuantity(mainProduct, variant) {
    console.log('this is tax', mainProduct);

    if (variant.variantContinueSelling == true) {
      mainProduct.maxQuantity =
        variant.variantQuantity > 0
          ? variant.variantQuantity
          : Number.MAX_VALUE;
      return [1, mainProduct.maxQuantity];
    } else {
      mainProduct.maxQuantity = variant.variantQuantity;
      const v = variant.variantQuantity > 0 ? 1 : 0;

      return [v, mainProduct.maxQuantity];
    }
  }

  calculateTax(data, quantity) {
    if (data.product.hasTax) {
      if (data.product?.hasVariant) {
        return (
          Math.round((data.variant[0].variantPrice * data.product.tax) / 100) *
          quantity
        );
      } else {
        return (
          Math.round((data.product.sellingPrice * data.product.tax) / 100) *
          quantity
        );
      }
    }
    return 0;
  }

  // calculateTotalTax() {
  //   this.tax = 0;
  //   for (let i = 0; i < this.carts?.length; i++) {
  //     this.tax += this.calculateTax(
  //       this.carts[i],
  //       this.carts[i].selectedQty
  //     );
  //   }
  //   return Math.floor(this.tax);
  // }

  onSelectVariant(sku, name, index, row, col) {
    this.clickActive[index][row] = col;
    this.setSku();
    let pSku = this.products[index].sku;
    //console.log(pSku);
    let tempTax;
    let variant = this.products[index].product.variantFormArray.filter(
      function (el) {
        return el.variantSku === pSku;
      }
    );

    console.log(' this.products variant[0]', this.products[index].product);

    this.products[index].price = variant[0].variantPrice;
    const tempV = this.getVariantQuantity(this.products, variant[0]);
    this.products[index].quantity = tempV[0];
    this.products[index].maxQuantity = tempV[1];
    this.products[index].tax =
      Math.round((variant[0].variantPrice * 50) / 100) *
      this.products[index].quantity;
    this.products[index].variantStockStatus =
      this.products[index].quantity == 0 ? false : true;
    this.products[index].variantStatus = true;
  }

  removeProduct(i) {
    const index = i;
    let newArray = this.products;
    newArray.splice(index, 1);
    this.products = newArray;
  }

  setSku() {
    for (let i = 0; i < this.products.length; i++) {
      let sku = this.products[i].product.sku + '-';
      for (let x = 0; x < this.clickActive[i].length; x++) {
        sku += this.clickActive[i][x];
      }
      this.products[i].sku = sku;
    }
  }

  onSubmit() {
    this.products.forEach((p) => {
      if (p.variantStatus === false) {
        this.isPermited = false;
        this.uiService.warn('Please select a variant');
      } else if (p.variantStockStatus === false) {
        this.isPermited = false;
        this.uiService.warn('Stock out, please select another variant/product');
      } else {
        this.isPermited = true;
      }
    });

    if (this.isPermited) {
      console.log('_-------------------------');
      this.setSku();
      this.order.orderedItems = this.products;
      let dt0 = new Date();
      let dt = this.utilsService.getCurrentDMY();
      let sku = '';

      let orderStatus = {
        status: 'Order Edited',
        adminInfo: this.admin.name,
        time: dt,
        sku: this.order.orderedItems[0].sku,
        dateTime: dt0,
        statusNote: this.dataForm.value.statusNote,
      };

      this.order.orderStatusTimeline.push(orderStatus);

      this.orderService.updateOrderById(this.order).subscribe(
        (res) => {
          this.order;
          this.uiService.success(res.message);
          this.getOrderDetailsById();
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log('from else');
    }
  }

  incrementQty(i: number) {
    // const sku = data?.sku;

    // const variantSku = this.holdProducts[i].product.variantFormArray.find((elem: any) => {
    //   return sku === elem?.variantSku;
    // })
    // console.log('products', this.products);
    // console.log('data', data);
    const item = this.products[i];
    if (item.quantity === item.maxQuantity) {
      this.uiService.warn('Maximum Quantity is selected');
    } else {
      this.products[i].quantity += 1;
    }

    // if (variantSku?.variantQuantity) {
    //   this.products[i].quantity += 1;
    //   data?.product?.variantFormArray.forEach((elem: any, i: number) => {
    //     // return sku === elem?.variantSku;
    //     if(sku === elem?.variantSku){
    //      elem.variantQuantity -= 1
    //     }

    //   });
    //   console.log('this.products[i].quantity', this.products[i].quantity);
    // } else {
    //   this.uiService.warn('Maximum Quantity is selected');
    //   return;
    // }
  }

  decrementQty(i) {
    if (this.products[i].quantity === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    this.products[i].quantity -= 1;
  }

  /***Search */

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
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
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  ngAfterViewInit(): void {
    // this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.query = data.trim();
          if (this.query === '' || this.query === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.query = null;
            return EMPTY;
          }
          // this.isLoading = true;
          const pagination: Pagination = {
            currentPage: '1',
            pageSize: '10',
          };
          const filter = { productVisibility: true };
          return this.productService.getSearchProduct(
            this.query,
            pagination,
            filter
          );
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchProducts = res.data;
          if (this.searchProducts.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  calculateSubTotal() {
    let total = 0;
    for (let i = 0; i < this.products.length; i++) {
      total += this.getAmount(this.products[i]);
    }
    return total;
  }

  getDeliveryFee() {
    return 0;
  }
}
