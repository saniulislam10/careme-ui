import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressPipe } from './address.pipe';
import { PricePipe } from './price.pipe';
import { SafeHtmlCustomPipe } from './safe-html.pipe';
import { SortPipe } from './sort.pipe';
import { RoleModifyPipe } from './role-modify.pipe';
import { NumberMinDigitPipe } from './number-min-digit.pipe';
import { SlugToNormalPipe } from './slug-to-normal.pipe';
import { OrderStatusPipe } from './order-status.pipe';
import { ArrayStringPipe } from './array-string.pipe';
import { DiscountPipe } from './discount.pipe';
import { TextWrapPipe } from './text-wrap.pipe';
import { HideDealOfDayPipe } from './hide-deal-of-day.pipe';
import { EmiStatusPipe } from './emi-status.pipe';
import { FormatBytesPipe } from './format-bytes.pipe';
import { ProductStatusPipe } from './product-status.pipe';
import { AmountTypePipe } from './amountType.pipe';
import { CoinPipe } from './coin.pipe';
import { ProductOrderStatusPipe } from './product-order-status.pipe';
import { PaymentStatusPipe } from './payment-status.pipe';
import { RequestPricePipe } from './requestPrice.pipe';
import { RequestCoinPipe } from './requestCoin.pipe';
import { VariantQuantityPipe } from './variantQuantity.pipe';
import { MenuPipe } from './menu.pipe';
import { PurchaseStatusPipe } from './purchase-status.pipe';
import { ShippingPipe } from './shipping.pipe';


@NgModule({
  declarations: [
    AddressPipe,
    PricePipe,
    CoinPipe,
    SafeHtmlCustomPipe,
    SortPipe,
    RoleModifyPipe,
    NumberMinDigitPipe,
    SlugToNormalPipe,
    OrderStatusPipe,
    ArrayStringPipe,
    DiscountPipe,
    TextWrapPipe,
    MenuPipe,
    HideDealOfDayPipe,
    EmiStatusPipe,
    FormatBytesPipe,
    ProductStatusPipe,
    AmountTypePipe,
    ProductOrderStatusPipe,
    PaymentStatusPipe,
    RequestPricePipe,
    RequestCoinPipe,
    PurchaseStatusPipe,
    VariantQuantityPipe,
    ShippingPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AddressPipe,
    PricePipe,
    CoinPipe,
    SafeHtmlCustomPipe,
    SortPipe,
    RoleModifyPipe,
    NumberMinDigitPipe,
    SlugToNormalPipe,
    OrderStatusPipe,
    DiscountPipe,
    TextWrapPipe,
    MenuPipe,
    HideDealOfDayPipe,
    EmiStatusPipe,
    FormatBytesPipe,
    ProductStatusPipe,
    AmountTypePipe,
    ProductOrderStatusPipe,
    PaymentStatusPipe,
    PurchaseStatusPipe,
    RequestPricePipe,
    RequestCoinPipe,
    VariantQuantityPipe,
    ShippingPipe
  ]
})
export class PipesModule {
}
