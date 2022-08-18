import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesByOrderRoutingModule } from './sales-by-order-routing.module';
import { SalesByOrderComponent } from './sales-by-order.component';


@NgModule({
  declarations: [
    SalesByOrderComponent
  ],
  imports: [
    CommonModule,
    SalesByOrderRoutingModule,
    MaterialModule
  ]
})
export class SalesByOrderModule { }
