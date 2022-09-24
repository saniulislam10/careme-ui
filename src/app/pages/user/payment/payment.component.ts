import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { Address } from 'src/app/interfaces/address';
import { Cart } from 'src/app/interfaces/cart';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { BulkSmsService } from 'src/app/services/bulk-sms.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { CoinPipe } from 'src/app/shared/pipes/coin.pipe';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';
import { environment } from 'src/environments/environment';
// import { ConfirmOrderDialogComponent } from '../checkout/confirm-order-dialog/confirm-order-dialog.component';
import { SslInit } from '../../../interfaces/ssl-init';
import { UtilsService } from 'src/app/services/utils.service';
import { PaymentSslService } from 'src/app/services/payment-ssl.service';
import { SslInitResponse } from '../../../interfaces/ssl-init-response';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [PricePipe, CoinPipe],
})
export class PaymentComponent implements OnInit {
  user: User;
  carts: Cart[] = [];
  total = 0;
  tax = 0;
  advance = 0;
  selectedAddress: Address;
  selectedPointsType: string;
  order: any = null;
  advancePaid: boolean = false;
  agreeConditions: boolean = false;

  // PAYMENT DATA
  currency = 'BDT';
  shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;

  orderType: string;

  // Coupon
  // couponText: string;
  // couponData: Coupon = null;
  // finalDiscount = 0;

  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private orderService: OrderService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private productService: ProductService,
    private pricePipe: PricePipe,
    private coinPipe: CoinPipe,
    private storageService: StorageService,
    private uiService: UiService,
    private router: Router,
    private storageSession: StorageService,
    private dialog: MatDialog,
    private bulkSmsService: BulkSmsService,
    private utilsService: UtilsService,
    private paymentSslService: PaymentSslService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.getCartsItems();
    this.getSelectedAddress();
    this.getSelectedPointsType();
    this.getLoggedInUserInfo();
  }

  /**
   * Http Req
   */

  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
    return Math.floor(this.total);
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

  advanceTotal() {
    this.advance = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      if (this.carts[i].variant.length > 0) {
        this.advance += this.advanceForSingle(
          this.carts[i].product,
          this.carts[i].selectedQty,
          this.carts[i].variant[0].variantPrice
        );
      } else {
        this.advance += this.advanceForSingle(
          this.carts[i].product,
          this.carts[i].selectedQty
        );
      }
    }
    return Math.floor(this.advance ? this.advance : 0);
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

  /**
   * On Submit
   */
  onSubmitOrder() {
    if (this.agreeConditions) {
        // this.placeOrder();
    } else {
      this.uiService.warn('Please agree to terms and conditions');
    }
  }
  getUserOrderText() {
    return this.storageSession.getDataFromSessionStorage(
      DATABASE_KEY.orderMessage
    );
  }
  placeOrder() {
    const orderItem =  this.getProductsFromCart();
    const TempVendors = orderItem.map((item)=>{
      return (
        item.vendorId
      )
    })
    let vendors = [...new Set(TempVendors)];

    console.log("wer are filtering vendors",vendors)

    this.order = {
      checkoutDate: new Date(),
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      subTotal: this.cartSubTotal(),
      shippingFee: 0,
      discount: 0,
      redeemAmount: this.redeemPointsTotal(),
      earnAmount: this.earnPointsTotal(),
      paidAmount: this.advanceTotal(),
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
      orderedItems:orderItem,
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
        this.router.navigate([environment.appBaseUrl, 'confirm', res.orderId]);
      },
      (err) => {
        this.uiService.warn('Order Could not be placed');
        console.log(err);
      }
    );
  }

  // getProductsFromCart() {
  //   const products = this.carts.map((m) => {
  //     const product = m.product as Product;
  //     let orderPrice = 0;
  //     let sku = '';
  //     let advance = 0;
  //     let vendor;

  //     if (product.hasVariant === true) {
  //       orderPrice = this.pricePipe.transform(
  //         product as Product,
  //         'priceWithoutTax',
  //         1,
  //         m.variant[0].variantPrice
  //       );
  //       vendor = m.variant[0].variantVendorName,

  //       console.log("this is vendor name: ", vendor)

  //       sku = m.variant[0].variantSku;
  //       advance = this.advanceForSingle(
  //         product,
  //         m.selectedQty,
  //         m.variant[0].variantPrice
  //       );
  //     } else {
  //       orderPrice = product.sellingPrice;
  //       sku = product.sku;
  //       advance = this.advanceForSingle(
  //         product,
  //         m.selectedQty
  //       );
  //     }

  //     console.log("For tax", product);

  //     return {
  //       product: product._id,
  //       price: orderPrice,
  //       sku: sku,
  //       vendor: vendor,
  //       discountType: product.discountType,
  //       discountAmount: product.discountAmount,
  //       quantity: m.selectedQty,
  //       tax: product.hasTax ? Math.round((product.tax * orderPrice) / 100): 0,
  //       status: ProductOrderStatus.PENDING,
  //       orderType: product?.quantity > 0 ? 'regular' : 'preorder',
  //       advance: advance
  //     } as OrderItem;
  //   });
  //   console.log("final product before,",products)
  //   return products;
  // }

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

  // private saveOrderInformationToTemp() {
  //   this.orderService.placeTempOrder(this.order).subscribe(
  //     (res) => {
  //       this.sslInitWithOrder(res.orderId, res._id);
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  // private sslInitWithOrder(orderId: string, id: string) {
  //   const baseHost = this.utilsService.getHostBaseUrl();

  //   const sslPaymentInit: SslInit = {
  //     store_id: null,
  //     store_passwd: null,
  //     total_amount: this.cartTotal(),
  //     currency: 'BDT',
  //     tran_id: orderId,
  //     success_url: baseHost + '/callback/payment/success',
  //     fail_url: baseHost + '/callback/payment/fail',
  //     cancel_url: baseHost + '/callback/payment/cancel',
  //     ipn_url: environment.sslIpnUrl,
  //     shipping_method: 'Courier',
  //     product_name: 'VIPER',
  //     product_category: "Mouse",
  //     product_profile: 'general',
  //     cus_name: this.user.fullName,
  //     cus_email: this.user.email ? this.user.email : 'N/A',
  //     cus_add1: this.user.address,
  //     cus_add2: '',
  //     cus_city: this.selectedAddress.city ? this.selectedAddress.city : 'N/A',
  //     cus_state: '',
  //     cus_postcode: 'N/A',
  //     cus_country: 'Bangladesh',
  //     cus_phone: this.user.phoneNo,
  //     cus_fax: '',
  //     ship_name: this.user.fullName,
  //     ship_add1: 'Baridhara',
  //     ship_add2: '',
  //     ship_city: this.selectedAddress.city ? this.selectedAddress.city : 'N/A',
  //     ship_state: '',
  //     ship_postcode: 'N/A',
  //     ship_country: 'Bangladesh',
  //     // multi_card_name: '',
  //     value_a: this.getUserOrderText(),
  //     // value_b: '',
  //     // value_c: '',
  //     // value_d: ''
  //   };

  //   this.paymentSslService.initSSLPayment(sslPaymentInit).subscribe(
  //     (res) => {
  //       const sslInitResponse: SslInitResponse = res.data;
  //       const sessionkey = sslInitResponse.sessionkey;
  //       this.orderService.updateOrderSessionKey(id, sessionkey).subscribe(
  //         (res3) => {
  //           const gatewayPageURL = sslInitResponse.GatewayPageURL;
  //           window.open(gatewayPageURL);
  //           // this.document.location.href = gatewayPageURL ? gatewayPageURL : '';
  //         },
  //         (error) => {
  //           this.uiService.wrong(
  //             'This order could not be processed at this time, please try again.'
  //           );
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
}
