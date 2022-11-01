import { Data } from './../../../admin/pages/products/add-new-product/add-new-product.component';
import { ShippingMethod } from './../../../interfaces/shipping-method';
import { ShippingService } from './../../../services/shipping.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MatDialog } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { AddAddressComponent } from './add-new-address/add-address.component';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Address } from 'src/app/interfaces/address';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Cart } from 'src/app/interfaces/cart';
import { DOCUMENT } from '@angular/common';
import { BulkSmsService } from 'src/app/services/bulk-sms.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { PaymentSslService } from 'src/app/services/payment-ssl.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CoinPipe } from 'src/app/shared/pipes/coin.pipe';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';
import { Product } from 'src/app/interfaces/product';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { filter, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZilaService } from 'src/app/services/zila.service';
import { ThanaService } from 'src/app/services/thana.service';
import { Zila } from 'src/app/interfaces/zila';
import { City } from 'src/app/interfaces/city';
import { Thana } from 'src/app/interfaces/thana';
import { CityService } from 'src/app/services/city.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-new-shopping-info',
  templateUrl: './new-shopping-info.component.html',
  styleUrls: ['./new-shopping-info.component.scss'],
  providers: [PricePipe, CoinPipe],
})
export class NewShoppingInfoComponent implements OnInit {
  isVisible = false;
  agreeChecked = false;
  pickAddress = 'A';
  zilla: Zila[] = [];
  city: City[] = [];
  thana: Thana[] = [];
  id: any;

  couponApplied: boolean;
  couponCode: any;
  v: string;
  dataForm?: FormGroup;
  methods: ShippingMethod[];
  subRouteOne: Subscription;
  showMethod: Boolean[]= [];

  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private storageService: StorageService,
    private uiService: UiService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private cartService: CartService,
    private productService: ProductService,
    private pricePipe: PricePipe,
    private coinPipe: CoinPipe,
    private orderService: OrderService,
    private storageSession: StorageService,
    private bulkSmsService: BulkSmsService,
    private zilaService: ZilaService,
    private cityService: CityService,
    private thanaService: ThanaService,
    private utilsService: UtilsService,
    private paymentSslService: PaymentSslService,
    private modal: NzModalService,
    private msg: NzMessageService,
    private shippingService: ShippingService,

    @Inject(DOCUMENT) private document: Document
  ) { }

  user: User;
  addressInfo: Address[] = [];
  // selectedAddress : any;
  clickActive = [];
  private subReload: Subscription;
  private subAddress: Subscription;

  //order
  // user: User;
  carts: Cart[] = [];
  total = 0;
  tax = 0;
  advance = 0;
  selectedAddress: Address;
  selectedPointsType: string;
  advancePaid: boolean = false;
  agreeConditions: boolean = false;
  Vindex: number;
  // PAYMENT DATA
  currency = 'BDT';
  shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;

  orderType: string;
  ngOnInit(): void {
    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });
    this.getUserAddress();
    this.getCartsItems();
    this.getSelectedAddress();
    this.getSelectedPointsType();
    this.getLoggedInUserInfo();
    this.initFormGroup();
    this.getAllShippingMethods();

  }

  private initFormGroup() {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      addressType: [null],
      country: ['bangladesh', Validators.required],
      city: [null, Validators.required],
      thana: [null, Validators.required],
      zila: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null],
    });

  }

  openDialog() {
    console.log('hit');
    this.dialog.open(AddAddressComponent);
  }

  /**
   * Http Req Address
   */

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select).subscribe(
      (res) => {
        this.user = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getUserAddress() {
    this.userDataService.getAllAddress().subscribe(
      (res) => {
        this.addressInfo = res.data;

        if (this.selectedAddress) {
          const i = this.addressInfo.findIndex(
            (f) => f._id == this.selectedAddress._id
          );
          this.clickActive[i] = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deleteAddress(index) {
    this.modal.warning({
      nzTitle: 'Are you sure ?',
      nzContent: 'You cannot undo this action anymore ',
      nzOnOk: () => {
        this.userDataService.deleteAddress(this.addressInfo[index]._id).subscribe(
          (res) => {
            console.log(res.message);
            this.reloadService.needRefreshAddress$();
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });

  }

  editAddressButton(data: Address) {
    this.showModal();
    this.selectedAddress = data;
    this.id = this.selectedAddress._id;
    this.dataForm.patchValue(data);
  }

  getThumbImage(product) {
    let images = this.productService.getImages(
      product.medias,
      product.images
    );
    return images.length ? images[0] : '/assets/images/placeholder/test.png';
  }

  onSelectAddress(address, i) {
    this.selectedAddress = address;
    console.log(this.selectedAddress);
    this.storageService.storeDataToSessionStorage(
      DATABASE_KEY.selectedShippingAddress,
      this.selectedAddress
    );
    this.clickActive = [];
    this.clickActive[i] = true;
  }

  ngOnDestroy(): void {
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
    this.subRouteOne.unsubscribe();
    // this.subAddress.unsubscribe();
  }

  /**
   * Http Req
   */

  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data.filter((f) => f.isSelected);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /**
   * Storage Session
   */
  getSelectedAddress() {
    this.selectedAddress = this.storageService.getDataFromSessionStorage(
      DATABASE_KEY.selectedShippingAddress
    );
  }

  getSelectedPointsType() {
    this.selectedPointsType = this.storageService.getDataFromSessionStorage(
      DATABASE_KEY.selectedPointsType
    );
  }

  /**
   * CART DATA
   */
  private getCartsItems() {
    if (this.userService.getUserStatus()) {
      this.getCartItemList();
    } else {
      this.getCartsItemFromLocal();
    }
  }

  private getCartsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map((m) => m.product as string);
      this.productService
        .getSpecificProductsById(
          ids,
          'productName productSlug  price discountType discountAmount  quantity images'
        )
        .subscribe((res) => {
          const products = res.data;
          window.scrollTo(0, 0);
          if (products && products.length > 0) {
            this.carts = items.map((t1) => ({
              ...t1,
              ...{ product: products.find((t2) => t2._id === t1.product) },
            }));
          }
        });
    } else {
      this.carts = [];
    }
  }

  cartPriceWithTax(data): any {
    if (data.product.hasVariant === true) {
      return this.pricePipe.transform(
        data.product as Product,
        'priceWithTax',
        data.selectedQty,
        data.variant[0].variantPrice
      ) as number;
    } else {
      return this.pricePipe.transform(
        data.product as Product,
        'priceWithTax',
        data.selectedQty
      ) as number;
    }
  }

  cartSubTotalForTotalWithoutTax(product, quantity, variantPrice?): number {
    return this.pricePipe.transform(
      product as Product,
      'priceWithoutTax',
      quantity,
      variantPrice
    ) as number;
  }

  cartSubTotalForTotal(product, quantity, variantPrice?): number {
    return this.pricePipe.transform(
      product as Product,
      'priceWithTax',
      quantity,
      variantPrice
    ) as number;
  }

  cartSubTotalProduct(data): any {
    if (data.product.hasVariant === true) {
      return Math.floor(
        this.pricePipe.transform(
          data.product as Product,
          'priceWithTax',
          data.selectedQty,
          data.variant[0].variantPrice
        ) as number
      );
    } else {
      return Math.floor(
        this.pricePipe.transform(
          data.product as Product,
          'priceWithTax',
          data.selectedQty
        ) as number
      );
    }
  }

  cartSubTotal() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        this.total += this.cartSubTotalForTotalWithoutTax(
          this.carts[i].product,
          this.carts[i].selectedQty,
          this.carts[i].variant[0].variantPrice
        );
      } else {
        this.total += this.cartSubTotalForTotalWithoutTax(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    return Math.floor(this.total);
  }
  cartSubTotalForRequest() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      this.total += this.carts[i].price * this.carts[i].selectedQty;
    }
    return Math.floor(this.total);
  }

  cartTotal() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        this.total += this.cartSubTotalForTotal(
          this.carts[i].product,
          this.carts[i].selectedQty,
          this.carts[i].variant[0].variantPrice
        );
      } else {
        this.total += this.cartSubTotalForTotal(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    if (this.selectedPointsType === '1') {
      this.total -= this.redeemPointsTotal();
    }
    return Math.floor(this.total + 120) - this.getCouponAmount();
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

  calculateTotalTax() {
    this.tax = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      this.tax += this.calculateTax(this.carts[i], this.carts[i].selectedQty);
    }
    return Math.floor(this.tax);
  }

  advanceForSingle(product, quantity, variantPrice?): number {
    return this.pricePipe.transform(
      product as Product,
      'advance',
      quantity,
      variantPrice
    ) as number;
  }

  // advanceTotal() {
  //   this.advance = 0;
  //   for (let i = 0; i < this.carts?.length; i++) {
  //     if (this.carts[i].variant.length > 0) {
  //       this.advance += this.advanceForSingle(
  //         this.carts[i].product,
  //         this.carts[i].selectedQty,
  //         this.carts[i].variant[0].variantPrice
  //       );
  //     } else {
  //       this.advance += this.advanceForSingle(
  //         this.carts[i].product,
  //         this.carts[i].selectedQty
  //       );
  //     }
  //   }
  //   return Math.floor(this.advance ? this.advance : 0);
  // }

  advanceTotal() {
    this.advance = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        const productVariant = this.carts[i].product.variantFormArray.find(
          (f) => f.variantSku === this.carts[i].variant[0].variantSku
        );
        if (
          this.carts[i].product.canPartialPayment &&
          productVariant.variantQuantity === 0
        ) {
          this.advance += this.advanceForSingle(
            this.carts[i].product,
            this.carts[i].selectedQty,
            this.carts[i].variant[0].variantPrice
          );
        }
      } else {
        this.advance += this.advanceForSingle(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    return this.advance;
  }

  redeemPointsTotal() {
    if (this.selectedPointsType === '1') {
      let totalRedeemPoints = 0;
      for (let i = 0; i < this.carts?.length; i++) {
        if (this.carts[i].variant.length > 0) {
          totalRedeemPoints += this.redeemPointsForSingle(
            this.carts[i].product,
            this.carts[i].selectedQty,
            this.carts[i].variant[0].variantPrice
          );
        } else {
          totalRedeemPoints += this.redeemPointsForSingle(
            this.carts[i].product,
            this.carts[i].selectedQty
          );
        }
      }
      return Math.floor(totalRedeemPoints);
    } else {
      return 0;
    }
  }

  earnPointsForSingle(product, quantity, variantPrice?): number {
    return this.coinPipe.transform(
      product as Product,
      'earn',
      quantity,
      variantPrice
    ) as number;
  }

  redeemPointsForSingle(product, quantity, variantPrice?): number {
    let pts = this.coinPipe.transform(
      product as Product,
      'redeem',
      quantity,
      variantPrice
    ) as number;
    return pts;
  }

  earnPointsTotal() {
    let totalEarnPoints = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        totalEarnPoints += this.earnPointsForSingle(
          this.carts[i].product,
          this.carts[i].selectedQty,
          this.carts[i].variant[0].variantPrice
        );
      } else {
        totalEarnPoints += this.earnPointsForSingle(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    return Math.floor(totalEarnPoints);
  }

  getUserOrderText() {
    return this.storageSession.getDataFromSessionStorage(
      DATABASE_KEY.orderMessage
    );
  }
  placeOrder() {
    const orderItem = this.getProductsFromCart();
    let order: Order = {
      checkoutDate: new Date(),
      orderedItems: orderItem,
      totalAmount: this.cartTotal(),
      advanceTotal: this.advanceTotal(),
      earnedPoints: this.earnPointsTotal(),
      redeemedPoints: this.redeemPointsTotal(),
      shippingCharge: 120,
      canceledAmount: 0,
      refundedAmount: 0,
      paidAmount: 0,
      userId: this.user._id,
      name: this.selectedAddress.name,
      phoneNo: this.user.phoneNo,
      address: this.user.address,
      email: this.user.email ? this.user.email : 'No Email',
      shippingAddress:
        this.selectedAddress.address +
        ', ' +
        this.selectedAddress.thana.name +
        ', ' +
        this.selectedAddress.city.name +
        ', ' +
        this.selectedAddress.zila.name,
      shippingPhoneNo: this.selectedAddress.phone
        ? this.selectedAddress.phone
        : this.user.phoneNo,
      orderStatusTimeline: [],
      comments: [],
      orderNotes: this.getUserOrderText(),
      gender: this.user.gender,
    };
    console.log(order);
    this.orderService.placeOrder(order).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageSession.removeSessionData(DATABASE_KEY.orderMessage);
        this.reloadService.needRefreshCart$();

        this.router.navigate([environment.appBaseUrl, 'success', res.orderId]);
      },
      (err) => {
        this.uiService.warn('Order Could not be placed');
        console.log(err);
      }
    );
  }

  getProductsFromCart() {
    console.log(this.carts);

    const products = this.carts.map((m) => {
      const product = m.product as Product;
      let image: any;

      if (product.hasVariant === true) {
        product.variantFormArray.map((q, index) => {
          if (q.variantSku == m.variant[0].variantSku) {
            return (this.Vindex = index), (image = m.variant[0].image);
          }
        });

        this.v = Object.values(product?.variantDataArray[this.Vindex])
          .toString()
          .replace(',', '/');
      } else {
        this.v = '';
      }

      let orderPrice = 0;
      let sku = '';
      let advance = 0;
      let vendor;

      if (product.hasVariant === true) {
        orderPrice = this.pricePipe.transform(
          product as Product,
          'priceWithoutTax',
          1,
          m.variant[0].variantPrice
        );
        (vendor = m.variant[0].variantVendorName),
          (sku = m.variant[0].variantSku);

        advance = this.advanceForSingle(
          product,
          m.selectedQty,
          m.variant[0].variantPrice
        );
      } else {
        orderPrice = product.sellingPrice;
        sku = product.sku;
        vendor = product.vendor;
        advance = this.advanceForSingle(product, m.selectedQty);
      }

      let orderedProduct: OrderItem = {
        productId: product._id,
        name: product.name,
        slug: product.slug,
        price: orderPrice,
        image: image,
        sku: sku,
        quantity: m.selectedQty,
        tax: product.hasTax ? Math.round((product.tax * orderPrice) / 100) : 0,
        vendorId: vendor._id,
        vendorName: vendor.name,
        brandId: product.brand._id,
        brandName: product.brand.name,
        productTypeId: product.productType[0]._id,
        productTypeName: product.productType[0].name,
        orderType: m.variant[0]?.variantQuantity > 0 ? 'regular' : 'preorder',
        variant: this.v,
        advanceAmount: m.variant[0]?.variantQuantity > 0 ? 0 : advance,
        deliveryStatus: ProductOrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        deliveryDateFrom: m.deliveryDateFrom,
        deliveryDateTo: m.deliveryDateTo,
        invoicedQuantity: 0,
        returnedQuantity: 0,
        returnPeriod: undefined,
        earnedAmount: undefined,
        redeemedAmount: undefined,
      };
      return orderedProduct;
    });
    console.log('final product before,', products);
    return products;
  }

  changeAgreeConditions() {
    this.agreeConditions = !this.agreeConditions;
  }

  getRoundValue(price, qty) {
    return Math.floor(price * qty);
  }

  //payment
  /**
   * BULK SMS
   */
  private sentSingleBulkSms(phoneNo: String, message: string) {
    this.bulkSmsService.sentSingleBulkSms(phoneNo, message).subscribe(
      (res) => {
        // console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  editLoggedInUserData(data: any) {
    this.userDataService.editLoginUserInfo(data).subscribe(
      (res) => {
        this.reloadService.needRefreshUser$();
      },
      (error) => {
        console.log(error);
      }
    );
  }
  /**
   * COMPONENT DIALOG VIEW
   */

  //calculation
  cartNewTotal() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        this.total += this.cartSubTotalForTotal(
          this.carts[i].product,
          this.carts[i].selectedQty,
          this.carts[i].variant[0].variantPrice
        );
      } else {
        this.total += this.cartSubTotalForTotal(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    return this.total;
  }

  /**
   * On Submit
   */
  onSubmit() {
    if (!this.selectedAddress) {
      this.msg.create('warning', 'Please Select an Address');
      return;
    } else if (!this.agreeChecked) {
      this.msg.create('warning', 'Please agree to terms and conditions');
      return;
    } else {
      this.placeOrder();
    }
  }

  getCouponAmount() {
    if (this.couponApplied) {
      let amount = this.cartNewTotal();
      return Math.floor(amount * 0.15);
    } else {
      return 0;
    }
  }

  applyCoupon() {
    let coupon = 'CAREME15%';
    if (this.couponCode.toUpperCase() === coupon.toUpperCase()) {
      this.couponApplied = true;
    } else {
      this.couponApplied = false;
    }
  }

  disableCoupon() {
    this.couponCode = '';
    this.couponCode.value = '';
    this.couponApplied = false;
  }

  // Mamun new Function
  showModal(): void {
    this.getAllZila();
    this.isVisible = true;
  }
  handleOk(): void {
    if (this.dataForm.invalid) {
      this.msg.warning("Please Complete All the required fields");
      return

    }
    let address = this.dataForm.value;
    if (this.id) {
      let finalData = {...address, ...{_id: this.id}}
      this.editAddress(finalData);
    }else{
      this.addAddress(address);
    }

  }

  addAddress(data: Address) {

    this.userDataService.addToAddress(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAddress$();
        this.isVisible = false;
      }, err => {
        console.log(err.message);
        this.msg.error("Add new address failed");
      });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  editAddress(address) {
    this.userDataService.editAddress(address)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAddress$();
        this.isVisible = false;
      }, error => {
        this.msg.error("Edit address failed");
      });
  }

  getAllZila() {
    this.zilaService.getAllZila()
      .subscribe(res => {
        this.zilla = res.data;
      }, error => {
        console.log(error);
      });
  }

  getAllCityByZilaId() {
    let zilaId;
    if(this.id){
      zilaId = this.selectedAddress.zila._id;
      console.log(zilaId);
    }else{
      zilaId = this.dataForm.value.zila;
    }
    if (zilaId) {
      this.cityService.getAllCityByZilaId(zilaId)
        .subscribe(res => {
          this.city = res.data;
          // if(this.id){
          //   this.dataForm.patchValue({
          //     city: this.city._id,
          //   })
          // };
          // this.filtercity = this.city.slice();
        }, err => {
          this.msg.error(err.message);
        });
    }
  }

  getAllThanaByCityId() {
    let cityId;
    if(this.id){
      cityId = this.selectedAddress.city._id;
    }else{
      cityId = this.dataForm.value.city;
    }
    if (cityId){
      this.thanaService.getAllThanasByCityId(cityId)
      .subscribe(res => {
        this.thana = res.data;
        // if(this.id){
        //   this.dataForm.patchValue({
        //     thana: this.data.thana._id,
        //   })
        // };
      }, err => {
        this.msg.error(err.message)
      });
    }

  }

  getAllShippingMethods(){
    this.subRouteOne = this.shippingService.getAll()
    .subscribe(res => {
      this.methods = res.data;
      for(let i=0; i<this.methods.length; i++){
        let data = this.methods[i];
        this.showMethods(data.customOpeningTime, data.openingTimesArray, i);
      }
      console.log(this.methods);
    }, err => {
      this.msg.error(err.message);
    })
  }


  showMethods(customOpen, data, index){
    if(customOpen){
      let date = new Date();
      let day = date.getDay();
      let currentHour = date.getHours();
      let currentMin = date.getMinutes();
      if(data[day].isOpen){
        if(data[day].timing.length){
          data[day].timing.forEach(m => {
            let startHour = new Date(m.startTime).getHours();
            let startMin = new Date(m.startTime).getMinutes();
            let endHour = new Date(m.endTime).getHours();
            let endMin = new Date(m.endTime).getMinutes();
            if(currentHour >= startHour && currentHour <= endHour){
              console.log(startHour,currentHour, endHour);
              this.showMethod[index] = true;
            }else{
              this.showMethod[index] = false;
            }
          });
        }else{
          this.showMethod[index] = false;
        }
      }else{
        this.showMethod[index] = false;
      }
    }else{
      this.showMethod[index] = true;
    }
    console.log(this.showMethod);
  }



}
