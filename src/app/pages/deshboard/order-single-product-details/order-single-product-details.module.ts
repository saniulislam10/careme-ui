import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSingleProductDetailsRoutingModule } from './order-single-product-details-routing.module';
import { OrderSingleProductDetailsComponent } from './order-single-product-details.component';


@NgModule({
  declarations: [
    OrderSingleProductDetailsComponent
  ],
  imports: [
    CommonModule,
    OrderSingleProductDetailsRoutingModule
  ]
})
export class OrderSingleProductDetailsModule { }
