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
import { OrderItem } from 'src/app/interfaces/order';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-new-shopping-info',
  templateUrl: './new-shopping-info.component.html',
  styleUrls: ['./new-shopping-info.component.scss'],
  providers: [PricePipe, CoinPipe],
})
export class NewShoppingInfoComponent implements OnInit {
  couponApplied: boolean;
  couponCode: any;
  v: string;
  constructor(
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
    private utilsService: UtilsService,
    private paymentSslService: PaymentSslService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  user: User;
  addressInfo : Address[] = [];
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
  order: any = null;
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
    this.reloadService.refreshAddress$
    .subscribe(() => {
      this.getUserAddress();
    });
    this.getUserAddress();
    this.getCartsItems();
    this.getSelectedAddress();
    this.getSelectedPointsType();
    this.getLoggedInUserInfo();
  }

  openDialog() {
    console.log('hit')
    this.dialog.open(AddAddressComponent);
  }

  /**
   * Http Req Address
   */

   private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
    .subscribe(res => {
      this.addressInfo = res.data;

      if(this.selectedAddress){
        const i = this.addressInfo.findIndex((f) => f._id == this.selectedAddress._id)
        this.clickActive[i] = true;
      }
      }, err => {
        console.log(err);
      });
  }

  deleteAddress(index){
    this.userDataService.deleteAddress(this.addressInfo[index]._id)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshAddress$();
      }, err => {
        console.log(err);
      });
  }

  editAddress(data: Address){
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.clickActive = [];
      this.storageService.removeSessionData(DATABASE_KEY.selectedShippingAddress);
      this.selectedAddress = null;
    });
  }

  onSelectAddress(address, i){
    this.selectedAddress = address;
    console.log(this.selectedAddress);
    this.storageService.storeDataToSessionStorage(DATABASE_KEY.selectedShippingAddress, this.selectedAddress);
    this.clickActive = [];
    this.clickActive[i] = true;
  }

  ngOnDestroy(): void {
    if(this.subReload){
      this.subReload.unsubscribe()
    }
    // this.subAddress.unsubscribe();

  }

  /**
   * Http Req
   */

   private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data.filter(f=>f.isSelected);
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


  cartSubTotalS(data): any {
    if(data.product.hasVariant === true){
      return Math.floor(this.pricePipe.transform(data.product as Product, 'priceWithTax', data.selectedQty, data.variant[0].variantPrice) as number);
    }else{
      return Math.floor(this.pricePipe.transform(data.product as Product, 'priceWithTax', data.selectedQty) as number);
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
    return Math.floor(this.total+120) - this.getCouponAmount();
  }

  cartTotalForRequest() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      this.total += this.carts[i].price * this.carts[i].selectedQty;
    }
    return Math.floor(this.total);
  }

  calculateTax(data, quantity) {
    if(data.product.hasTax){
      if(data.product?.hasVariant ){
        return Math.round((data.variant[0].variantPrice*data.product.tax)/100) * quantity;
      }else{
        return Math.round((data.product.sellingPrice*data.product.tax)/100) * quantity;
      }
    }
    return 0

  }

  calculateTotalTax() {
    this.tax = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      this.tax += this.calculateTax(
        this.carts[i],
        this.carts[i].selectedQty
      );
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

  advanceTotal(){
    this.advance = 0;
    for(let i=0; i< this.carts?.length; i++){
      if(this.carts[i].variant.length > 0){
        const productVariant = this.carts[i].product.variantFormArray.find(f => f.variantSku === this.carts[i].variant[0].variantSku);
        if (this.carts[i].product.canPartialPayment && productVariant.variantQuantity === 0) {
          this.advance += this.advanceForSingle(this.carts[i].product, this.carts[i].selectedQty, this.carts[i].variant[0].variantPrice);
        }
      }else{
        this.advance += this.advanceForSingle(this.carts[i].product, this.carts[i].selectedQty );
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

  earnPointsTotal(){
    let totalEarnPoints = 0;
    for(let i=0; i< this.carts?.length; i++){
      if(this.carts[i].variant.length > 0){
        totalEarnPoints += this.earnPointsForSingle(this.carts[i].product, this.carts[i].selectedQty, this.carts[i].variant[0].variantPrice);

      }else{
        totalEarnPoints += this.earnPointsForSingle(this.carts[i].product, this.carts[i].selectedQty );
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
    const orderItem =  this.getProductsFromCart()
    const TempVendors = orderItem.map((item)=>{
      return (
        item.vendor
      )
    })

    let vendors = [...new Set(TempVendors)];

    console.log("address",this.selectedAddress)

    this.order = {
      checkoutDate: new Date(),
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      subTotal: this.cartSubTotal(),
      shippingFee: 0,
      discount: 0,
      redeemAmount: this.redeemPointsTotal(),
      earnAmount: this.earnPointsTotal(),
      //paidAmount: this.advanceTotal(),
      paidAmount: 0,
      totalAmount: this.cartTotal(),
      totalAmountWithDiscount: this.cartTotal(),
      deletedProduct: false,
      refundAmount: 0,
      paymentMethod: 'Cash On Delivery',
      paymentStatus: PaymentStatus.UNPAID,
      city: this.selectedAddress.city,
      phoneNo: this.selectedAddress.phone,
      name: this.user.fullName,
      address: this.user.address,
      shippingAddress:
        this.selectedAddress.address +
        ', ' +
        this.selectedAddress.thana.name +
        ', ' +
        this.selectedAddress.city.name +
        ', ' +
        this.selectedAddress.zila.name,
      orderTimeline: {
        others: false,
        othersData: null,
        orderPlaced: false,
        orderPlacedDate: new Date(),
        orderProcessing: false,
        orderProcessingDate: null,
        orderPickedByDeliveryMan: false,
        orderPickedByDeliveryManDate: null,
        orderDelivered: false,
        orderDeliveredDate: null,
      },
      hasPreorderItem: false,
      orderedItems: orderItem,

      vendors:vendors,
      orderNotes: this.getUserOrderText(),
      comments: [],
      orderStatusTimeline: [],
      sessionkey: null,
      // productID:productID
    };

    this.orderService.placeOrder(this.order).subscribe(
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

  placeOrderForRequest() {
    let cartItems: any[] = [];
    let subTotal = 0;
    for (let i = 0; i < this.carts.length; i++) {
      cartItems[i] = {
        name: this.carts[i].name,
        quantity: this.carts[i].selectedQty,
        price: this.carts[i].price,
        image: this.carts[i].image,
        link: this.carts[i].link,
        status: OrderStatus.PENDING,
      };
      subTotal += this.carts[i].price * this.carts[i].selectedQty;
    }
    this.order = {
      checkoutDate: new Date(),
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      subTotal: Math.floor(subTotal),
      shippingFee: 0,
      discount: 0,
      redeemAmount: 0,
      earnAmount: this.earnPointsTotal(),
      paidAmount: this.advanceTotal(),
      totalAmount: this.cartTotalForRequest(),
      totalAmountWithDiscount: this.cartTotal(),
      deletedProduct: false,
      refundAmount: 0,
      paymentMethod: 'Cash On Delivery',
      paymentStatus: PaymentStatus.UNPAID,
      city: this.selectedAddress.city,
      phoneNo: this.selectedAddress.phone,
      name: this.user.fullName,
      address: this.user.address,
      shippingAddress:
        this.selectedAddress.address +
        ', ' +
        this.selectedAddress.thana.name +
        ', ' +
        this.selectedAddress.city.name +
        ', ' +
        this.selectedAddress.zila.name,
      orderTimeline: {
        others: false,
        othersData: null,
        orderPlaced: false,
        orderPlacedDate: new Date(),
        orderProcessing: false,
        orderProcessingDate: null,
        orderPickedByDeliveryMan: false,
        orderPickedByDeliveryManDate: null,
        orderDelivered: false,
        orderDeliveredDate: null,
      },
      hasPreorderItem: false,
      orderedItems: cartItems,
      orderNotes: this.getUserOrderText(),
      requestOrder: true,
      comments: [],
      orderStatusTimeline: [],
    };

    this.orderService.placeOrderRequest(this.order).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageSession.removeSessionData(DATABASE_KEY.orderMessage);
        this.router.navigate([environment.appBaseUrl, 'confirm', res.orderId]);
      },
      (err) => {
        this.uiService.warn('Order Could not be placed');
        console.log(err);
      }
    );
  }

  getProductsFromCart() {
    const products = this.carts.map((m) => {
      const product = m.product as Product;
      let image: any;



      if (product.hasVariant === true) {
        product.variantFormArray.map((q,index)=>{
          if(q.variantSku ==m.variant[0].variantSku){
            return(
              this.Vindex = index,
              image = m.variant[0].image
              )
            }
          })

          this.v = (Object.values(product?.variantDataArray[this.Vindex]).toString()).replace(',','/')
        }else{
          this.v= "";
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
        vendor = m.variant[0].variantVendorName,

        sku = m.variant[0].variantSku;

        advance = this.advanceForSingle(
          product,
          m.selectedQty,
          m.variant[0].variantPrice
        );
      } else {
        orderPrice = product.sellingPrice;
        sku = product.sku;
        advance = this.advanceForSingle(
          product,
          m.selectedQty
        );
      }

      return {
        product: product._id,
        price: orderPrice,
        sku: sku,
        vendor: vendor,
        discountType: product.discountType,
        discountAmount: product.discountAmount,
        quantity: m.selectedQty,
        variant: this.v,
        image: image,
        tax: product.hasTax ? Math.round((product.tax * orderPrice) / 100): 0,
        status: ProductOrderStatus.PENDING,
        orderType: m.variant[0]?.variantQuantity>0 ? 'regular' : 'preorder',
        advance: m.variant[0]?.variantQuantity>0 ? 0 : advance,
        deliveryDateFrom: m.deliveryDateFrom,
        deliveryDateTo: m.deliveryDateTo,
      } as OrderItem;
    });
    console.log("final product before,",products)
    return products;
  }

  changeAgreeConditions() {
    this.agreeConditions = !this.agreeConditions;
  }

  getRoundValue(price, qty){
    return Math.floor(price*qty);
  }

  //payment
  /**
   * BULK SMS
   */
  private sentSingleBulkSms(phoneNo: string, message: string) {
    this.bulkSmsService.sentSingleBulkSms(phoneNo, message).subscribe(
      (res) => {
        // console.log(res);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // onDistrictChange(event: MatSelectChange) {
  //   this.getFinalShippingCharge();
  //   const districtId = this.districts.find(f => f.district === event.value)._id;
  //   const filter = {district: districtId};
  //   this.getAllAreaByDistrict(filter);
  // }

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

  private saveOrderInformationToMain() {
    this.orderService.placeOrder(this.order).subscribe(
      (res) => {
        // this.couponData = null;
        // this.couponText = null;
        // this.storageService.storeCouponData(this.couponData);

        // Update User Info
        // const updateUserData = {
        //   fullName: this.dataForm.value.name,
        //   email: this.dataForm.value.email,
        //   district: this.dataForm.value.district,
        //   area: this.dataForm.value.area,
        //   shippingAddress: this.dataForm.value.shippingAddress
        // };
        // this.editLoggedInUserData(updateUserData);
        // this.reloadService.needRefreshCart$();
        // Create Message Data
        const finalPhoneNo = this.order.phoneNo;
        const message = `Dear ${this.order.name}, Your order ${res.orderId} has been placed. We will update you once the order is confirmed. Thank you for shopping at www.emedilife.com`;
        this.sentSingleBulkSms(finalPhoneNo, message);
        this.uiService.success(res.message);
        this.router.navigate(['/account/order-list']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //calculation
  cartNewTotal(){
    this.total = 0;
    for(let i=0; i< this.carts?.length; i++){
      if(this.carts[i].variant.length > 0){
        this.total += this.cartSubTotalForTotal(this.carts[i].product, this.carts[i].selectedQty, this.carts[i].variant[0].variantPrice);
      }else{
        this.total += this.cartSubTotalForTotal(this.carts[i].product, this.carts[i].selectedQty );
      }
    }
    return this.total;
  }

  /**
   * On Submit
   */
   onSubmit(){

    if (!this.selectedAddress){
      this.uiService.warn("Please Select an Address");
    }
    if(!this.agreeConditions){
      this.uiService.warn('Please agree to terms and conditions');
    }
    if(this.selectedAddress && this.agreeConditions){

      if (this.carts[0]?.requestProduct) {
              this.placeOrderForRequest();
            } else {
              this.placeOrder();
            }
      // this.router.navigate([environment.appBaseUrl, 'delivery-info']);
    }


    // if(this.selectedAddress){
    //   this.router.navigate([environment.appBaseUrl, 'delivery-info']);
    // }else{
    //   this.uiService.warn("Please Select an Address");
    // }
    // if (this.agreeConditions) {
    //     if (this.carts[0].requestProduct) {
    //       this.placeOrderForRequest();
    //     } else {
    //       this.placeOrder();
    //     }
    // } else {
    //   this.uiService.warn('Please agree to terms and conditions');
    // }




  }

  getCouponAmount(){
    if(this.couponApplied){
      let amount = this.cartNewTotal();
      return Math.floor(amount * 0.15);
    }else{
      return 0
    }
  }

  applyCoupon(){
    let coupon = "CAREME15%"
    if(this.couponCode.toUpperCase() === coupon.toUpperCase()){
      this.couponApplied = true;
    }else{
      this.couponApplied = false;
    }
  }

  disableCoupon(){
    this.couponCode = '';
    this.couponCode.value = '';
    this.couponApplied = false;
  }

}


