import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanceledOrderRoutingModule } from './canceled-order-routing.module';
import { CanceledOrderComponent } from './canceled-order.component';


@NgModule({
  declarations: [
    CanceledOrderComponent
  ],
  imports: [
    CommonModule,
    CanceledOrderRoutingModule
  ]
})
export class CanceledOrderModule { }
