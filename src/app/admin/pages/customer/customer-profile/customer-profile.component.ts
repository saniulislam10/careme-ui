import { ActivatedRoute } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EMPTY, Subscription } from 'rxjs';
import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/interfaces/user';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AmountType } from 'src/app/enum/amount-type';
import { UserStatus } from 'src/app/enum/user-status';
import { ReloadService } from 'src/app/services/reload.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Select } from 'src/app/interfaces/select';
import { Product } from 'src/app/interfaces/product';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { Pagination } from 'src/app/interfaces/pagination';
import { ProductService } from 'src/app/services/product.service';
import { Cart } from 'src/app/interfaces/cart';
import { UiService } from 'src/app/services/ui.service';
import { CartService } from 'src/app/services/cart.service';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';

import { OrderStatus } from 'src/app/enum/order-status';
// import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { OrderService } from 'src/app/services/order.service';
import { TagService } from 'src/app/services/tag.service';
import { Tag } from 'src/app/interfaces/tag';
import { UtilsService } from 'src/app/services/utils.service';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { PaymentStatus } from 'src/app/enum/payment-status';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
  providers: [PricePipe],
})
export class CustomerProfileComponent implements OnInit {
  // SEARCH AREA
  searchProducts: Product[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  /* DeliveryOptions */
  deliveryOptions: Select[] = [
    { viewValue: 'Pathao', value: 'pathao' },
    { viewValue: 'REDX', value: 'redx' },
    { viewValue: 'Sundarban Courier Service', value: 'sundarban-courier' },
    { viewValue: 'SA Paribahan', value: 'sa-paribahan' },
  ];
  //convert to enum
  // Cart
  productCart: any[] = [];
  //order
  order: Order;

  shippingCharge: number = 20;
  finalDiscount: number = 0;
  //subscription
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  //active Component
  subComponent:string="regular-order"

  // block user form
  isChecked = null;
  dataForm: FormGroup;
  tagForm: FormGroup;

  createOrder = false;
  emailEditor = false;
  id: any;
  user: User;
  lastOrderDate: any;

  // tag
  tags: Tag[] = [];

  //order
  orders:Order[]=[];
  clickActive: boolean[][] = [[]];

  //discount
  @ViewChild('discountInput') discountInput: ElementRef;
  @ViewChild('deliveryFees') deliveryFees: ElementRef;

  totalDiscount:number=0;
  totalDeliveryFee:number=0;
  selectedProducts: Product[] = [];
  variantOptions = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private userDataService: UserDataService,
    private fb: FormBuilder,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private uiService: UiService,
    private cartService: CartService,
    private pricePipe: PricePipe,
    private orderService: OrderService,
    private userService: UserService,
    private tagService: TagService,
    private utilsService:UtilsService
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.initFormValue();
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getCustomerInfo();
        this.getAllTag();
        this.getOrders();
      }
    });

    this.reloadService.refreshUser$.subscribe(() => {
      this.getCustomerInfo();
      this.getAllTag();
    });

    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    this.getCartsItems();
    this.reloadService.refreshOrder$.subscribe(() => {
      this.getOrders();
    });

  }
  /* After View Init */
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

  /* SEARCH */

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
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

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

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

  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    console.log(data);

    this.selectedProducts.push(data);
    // this.addToUserCart(data);
  }

  /* INIT FORM */
  initFormValue() {
    this.dataForm = this.fb.group({
      fullName: [null, Validators.required],
      email: [null],
      phoneNo: [null, Validators.required],
      shippingAddress: [null, Validators.required],
      deliveryOption: [null, Validators.required],
      message: [null],
    });

    this.tagForm = this.fb.group({
      tag: [null],
    });
  }
  /**
   * Http Req
   */

  // get single user
  private getCustomerInfo() {
    this.subDataOne = this.userDataService.getUserByUserID(this.id).subscribe(
      (res) => {
        this.user = res.data;
        this.checkStatus();
        this.dataForm.patchValue(this.user);
        this.tagForm.patchValue(this.user.tag);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  // get carts
  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.productCart = res.data;
        console.log(this.productCart);

        // window.scrollTo(0, 0);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /* remove item from cart */
  private removeCartItem(cartId: string) {
    this.cartService.removeCartItem(cartId).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  //check user status
  checkStatus() {
    if (this.user.status === 0) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  /* Update user info */
  saveUserInfo() {

    const userData = {
      fullName: this.dataForm.value.fullName,
      shippingAddress: this.dataForm.value.shippingAddress,
      email: this.dataForm.value.email,
      phoneNo: this.dataForm.value.phoneNo,
      _id: this.id,
    };
    this.userDataService.editLoginUserInfo(userData).subscribe(
      (res) => {
      console.log(res.message);
    },(err) => {
      console.log(err);
    }
    );
  }

  /**** create Order Toggle */
  createOrderShow() {
    this.createOrder = true;
  }
  createOrderHide() {
    this.createOrder = false;
  }

  /*** email editor toggle */
  emailEditorShow() {
    this.emailEditor = true;
  }

  emailEditorHide() {
    this.emailEditor = false;
  }
  /* Cart */
  addToUserCart(data: Product) {
    const newData: Cart = {
      product: data._id,
      selectedQty: 1,
    };
    this.addItemToCartDB(newData);

  }
  addItemToCartDB(data: Cart) {
    this.userDataService.addItemToUserCart(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  private getCartsItems() {
    this.getCartItemList();
    // if (this.userService.getUserStatus()) {
    // } else {
    //   this.getCarsItemFromLocal();
    // }
  }

  get cartSubtotal() {
    /* let total = 0;
    this.productCart.map((item) => {
      total = total + item.product.sellingPrice;
    });
    return total; */
    let total:number=0;
    this.productCart.map(e=>{
      const eTotal=this.getTotal(e);
      total=total+eTotal;
    })
    total=total+this.totalDeliveryFee*1;
    total=total-this.totalDiscount;
    return total;

  }

  onDeleteCartItem(cartId: string) {
    this.removeCartItem(cartId);
    this.reloadService.needRefreshCart$();
  }

  /**
   * block user
   */
  blockUserSubmit(data) {
    this.spinner.show();
    if (data === true) {
      let userstatus = UserStatus.BLOCK;
      let data = { ...this.user, ...{ status: userstatus } };

      this.updateUser(data);
    } else {
      let userstatus = UserStatus.ACTIVE;
      let data = { ...this.user, ...{ status: userstatus } };
      this.updateUser(data);
    }
  }

  updateUser(data) {
    this.userDataService.editLoginUserInfo(data).subscribe(
      (res) => {
        this.reloadService.needRefreshUser$();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }
 private getOrders(){
   this.orderService.getAllOrdersofyUserByAdmin(null,null,this.id)
   .subscribe(res=>{
     this.orders=res.data;
   })
 }

  /* FORM SUBMISSSION */
  onSubmitForm() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Invalid Form Value');
      return;
    }

    // this.placeOrder();
  }

  /* Place Order */

  getTotalSpent(){
    let totalAmountSpent = 0;
    // for (let i=0; i < this.user?.checkouts.length; i++){
    //   totalAmountSpent += this.user?.checkouts[i].totalAmount ?;
    // }
    return totalAmountSpent;
  }

  getAverageOrderValue(){
    let totalAmountSpent = 0;
    // for (let i=0; i < this.user?.checkouts?.length; i++){
    //   totalAmountSpent += this.user?.checkouts[i].totalAmount;
    // }
    return Math.floor(totalAmountSpent/this.user?.checkouts?.length);
  }

  /**
   * Tag Selection
   */
   onSelectTag(tag: any){
    const newtag={
      tag:tag.value._id,
      activationdate:this.utilsService.getCurrentDMY()
    }
    this.user.tag.push(newtag);
    let data = { ...this.user };
      this.updateUser(data);
      this.reloadService.needRefreshUser$();
   }

   //http req for tag
   getAllTag(){
    this.tagService.getAllTags()
    .subscribe(res => {
      this.tags = res.data;
    })
   }


   /* order */
   activeSubComponent(componentName){
    this.subComponent=componentName
   }

   incrementQty(cartId: string, index: number) {
    if (this.userService.getUserStatus()) {
      this.incrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty + 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }
  }

  decrementQty(cartId: string, index: number, sQty: number) {
    if (this.userService.getUserStatus()) {
      if (sQty === 1) {
        this.uiService.warn('Minimum quantity is 1');
        return;
      }
      this.decrementCartQtyDB(cartId);
    } else {
      const data = this.cartService.getCartItemFromLocalStorage();
      if (data[index].selectedQty === 1) {
        return;
      }
      if (data != null) {
        data[index].selectedQty = data[index].selectedQty - 1;
        localStorage.setItem(DATABASE_KEY.userCart, JSON.stringify(data));
        this.reloadService.needRefreshCart$();
      }
    }

  }

  private incrementCartQtyDB(cartId: string) {
    this.cartService.incrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  private decrementCartQtyDB(cartId: string) {
    this.cartService.decrementCartQuantity(cartId)
      .subscribe(() => {
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }

  getTotal(data){
    return data.selectedQty*data.product.sellingPrice
  }



  handleDeliveryChange(value:number){
    this.totalDeliveryFee=value;
  }

  handleDiscountChange(value:number){
    this.totalDiscount=value;
  }

  /**
   * Variant
   */

   variantSplit(index, product) {
     console.log("Index", index);
    let variantOptions = [];
    console.log(product.options);

    for (let i = 0; i < product.options.length; i++) {
      variantOptions[i] = product.options[i].split(',');
    }
    console.log("variantOptions", variantOptions[index]);
    return variantOptions[index];
  }

}
