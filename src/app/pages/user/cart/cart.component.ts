import { Variant } from './../../../interfaces/cart';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { Cart } from 'src/app/interfaces/cart';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { CoinPipe } from 'src/app/shared/pipes/coin.pipe';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [PricePipe, CoinPipe],
})
export class CartComponent implements OnInit {
  isVisible = false;
  carts: Cart[] = [];
  mCarts: Cart[] = [];
  clickActive: any[] = [];
  total: number = 0;
  advance: number = 0;
  pointsType: string = '2';
  dataForm: FormGroup;
  public images: any;
  vCarts: any[] = [];

  // User
  user: User = null;
  globalQty: any;

  vendorGroupId: string = null;
  sGI: number;
  sPI: number;
  selectedProductSku: any;
  selectedVariant: any;
  selectedGroupIndex: any;
  selectedIndex: any;
  disableApplyButton: boolean = false;
  constructor(
    private reloadService: ReloadService,
    private userService: UserService,
    private cartService: CartService,
    private uiService: UiService,
    private productService: ProductService,
    private pricePipe: PricePipe,
    private coinPipe: CoinPipe,
    private storageSession: StorageService,
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems();
    });
    this.getCartsItems();
  }
  private initFormGroup() {
    this.dataForm = this.fb.group({
      message: [null],
    });

    this.getUser();

    let pType = this.storageSession.getDataFromSessionStorage(
      DATABASE_KEY.selectedPointsType
    );
    if (pType) {
      this.pointsType = pType;
    }
  }

  /**
   * Session Storage
   */

  onContinueToShipping() {
    if (this.pointsType === '1') {
      if (this.user?.points < this.redeemPointsTotal()) {
        this.uiService.warn('Insuffient points to redeem');
        return;
      }
    }
    this.storageSession.storeDataToSessionStorage(
      DATABASE_KEY.selectedPointsType,
      this.pointsType
    );

    this.setUserOrderText();
    this.router.navigate(['new-shipping-info']);
  }

  //  isDisabled(value: boolean) {
  //   this.isDisabled = value;
  //   if(value) {
  //    this.form.controls['name'].disable();
  //   } else {
  //      this.form.controls['name'].enable();
  //    }
  //  }

  /**
   * Http Req
   */

  private getUser() {
    this.userDataService.getLoggedInUserInfo().subscribe(
      (res) => {
        this.user = res.data;
      },
      (error) => {
        console.log(error);
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

  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.mCarts = res.data;
        this.carts = this.mCarts.filter((m) => m.isSelected);
        console.log(this.mCarts);
        const fCarts = this.mCarts.map((m) => {
          return {
            ...m,
            // variant: m.variant[0],
            vendorName: m.product.hasVariant
              ? m.variant[0].variantVendorName.name
              : m.product.vendor.name,
          };
        });

        console.log('fCarts', fCarts);

        this.vCarts = this.arrayGroupByField(fCarts, 'vendorName');
        console.log('this.vCarts', this.vCarts);
        this.vCarts.forEach((f) => {
          // if (f._id === 'careme') {
          const selected = f.data.filter((g) => g.isSelected === true);
          if (selected.length === f.data.length) {
            f.select = true;
          } else {
            f.select = false;
          }
          // }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // get images collaboration
  getThumbImage(data) {
    let images = this.productService.getImages(
      data.product.medias,
      data.product.images
    );
    return images.length ? images[0] : '/assets/images/placeholder/test.png';
  }

  private incrementCartQtyDB(cartId: string) {
    this.cartService.incrementCartQuantity(cartId).subscribe(
      (res) => {
        if (res.msg) {
          this.uiService.warn(res.msg);
        }
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
        this.reloadService.needRefreshCart$();
      }
    );
  }

  private decrementCartQtyDB(cartId: string) {
    this.cartService.decrementCartQuantity(cartId).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
        this.reloadService.needRefreshCart$();
      }
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

  onDeleteCartItem(cartId: string, cart: any, product?: string) {
    if (this.userService.getUserStatus()) {
      this.removeCartItem(cartId, cart);
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
    }
  }

  private removeCartItem(cartId: string, cart) {
    this.cartService.removeCartItem(cartId).subscribe(
      () => {
        this.reloadService.needRefreshCart$();
        this.addToAbandonedCart(cart);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteUserCartList() {
    this.cartService.deleteUserCartList().subscribe(
      () => {
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addToAbandonedCart(data) {
    this.cartService.addToAbandonedCart(data).subscribe(
      (res) => {
        console.log(res.message);
      },
      (err) => {
        console.log(err);
      }
    );
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

  /**
   * LOGICAL METHODS
   */

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
    console.log('this is index', index);
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

  roundPrice(price) {
    return Math.floor(price);
  }

  cartSubTotal(data): any {
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

  cartSubTotalForTotal(product, quantity, variantPrice?): number {
    return this.pricePipe.transform(
      product as Product,
      'priceWithTax',
      quantity,
      variantPrice
    ) as number;
  }

  cartSubTotalForRequest(price, quantity) {
    return Math.floor(price * quantity);
  }

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
    if (this.pointsType === '1') {
      this.total -= this.redeemPointsTotal();
    }
    return this.total;
  }

  cartTotalForRequest() {
    this.total = 0;
    for (let i = 0; i < this.carts?.length; i++) {
      this.total += Math.floor(this.carts[i].price * this.carts[i].selectedQty);
    }
    return Math.floor(this.total);
  }

  advanceForSingle(product, quantity, variantPrice?): number {
    let advance = this.pricePipe.transform(
      product as Product,
      'advance',
      quantity,
      variantPrice
    ) as number;
    return advance;
  }

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
    return totalEarnPoints;
  }

  redeemPointsTotal() {
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
    return totalRedeemPoints;
  }

  setUserOrderText() {
    this.storageSession.storeDataToSessionStorage(
      DATABASE_KEY.orderMessage,
      this.dataForm.value.message
    );
  }

  getTax(tax, data, quantity) {
    if (data.product?.hasVariant) {
      return Math.round(
        ((data.variant[0].variantPrice * tax) / 100) * quantity
      );
    } else {
      return Math.round(((data.product.sellingPrice * tax) / 100) * quantity);
    }
  }

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.cartService
        .updateCart({ cartId: id, isSelected: true })
        .subscribe((res) => {
          if (res.success) {
            this.getCartItemList();
            console.log('updated');
          }
        });
    } else {
      this.cartService
        .updateCart({ cartId: id, isSelected: false })
        .subscribe((res) => {
          if (res.success) {
            this.getCartItemList();
            console.log('updated');
          }
        });
    }
  }

  private checkSelectionData() {
    let isAllSelect = true;
    // this.tags.forEach(m => {
    //   if (!m.select) {
    //     isAllSelect = false;
    //   }
    // });

    //this.matCheckbox.checked = isAllSelect;
  }

  onCheckVendorGroup(event: any, index: number) {
    const group = this.vCarts[index];
    console.log('group', group);
    let cartData;
    if (event) {
      cartData = {
        cartIds: group.data.map((m) => m._id),
        data: { isSelected: true },
      };
    } else {
      cartData = {
        cartIds: group.data.map((m) => m._id),
        data: { isSelected: false },
      };
    }
    this.cartService.updateCartMultiple(cartData).subscribe((res) => {
      if (res.success) {
        this.getCartItemList();
      }
    });
  }
  showModal(gIndex, index, variant): void {
    console.log(index);
    this.selectedGroupIndex = gIndex;
    this.selectedIndex = index;
    this.sGI = gIndex;
    this.sPI = index;
    this.isVisible = true;
    this.patchVariant(variant);
  }

  handleOk(): void {
    let obj = this.vCarts[this.selectedGroupIndex].data[this.selectedIndex];
    console.log(obj.product._id);

    // this.vCarts[this.selectedGroupIndex].data[this.selectedIndex].variant[0] = this.selectedVariant;

    let data = {
      id: obj._id,
      productId: obj.product._id,
      variant: this.selectedVariant,
    };
    this.cartService.editVariantInCart(data).subscribe(
      (res) => {
        console.log(res);
        this.reloadService.needRefreshCart$();
        this.isVisible = false;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getOptions(option) {
    return option.split(',');
  }

  onSelectVariant(product, sku, name, index, row, col) {
    this.clickActive[row] = col;
    this.setSku(sku, product);
  }
  setSku(sku, product) {
    let newSku = sku + '-';
    for (let i = 0; i < this.clickActive.length; i++) {
      newSku += this.clickActive[i];
    }
    this.selectedProductSku = newSku;
    let arr = product.variantFormArray;
    this.selectedVariant = arr.find(
      (data) => data.variantSku === this.selectedProductSku
    );
    console.log(this.selectedVariant);
    if (
      this.selectedVariant.variantQuantity === 0 &&
      this.selectedVariant.variantContinueSelling !== true
    ) {
      console.log(this.selectedVariant.variantContinueSelling);
      console.log('Product is Out of stock');
      this.disableApplyButton = true;
    } else {
      this.disableApplyButton = false;
    }
  }
  patchVariant(variant) {
    console.log(variant);

    this.selectedVariant = variant;
    this.selectedProductSku = variant.variantSku;
    let a = variant.variantSku.split('-')[1];
    for (let i = 0; i < a.length; i++) {
      this.clickActive[i] = Number(a[i]);
    }
  }

  // Mamun New Cart
  isCheckedButton = false;
  isDisabledButton = false;

  checkButton(): void {
    this.isCheckedButton = !this.isCheckedButton;
  }
  disableButton(): void {
    this.isDisabledButton = !this.isDisabledButton;
  }
}
