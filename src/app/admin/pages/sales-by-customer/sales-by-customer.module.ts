import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesByCustomerRoutingModule } from './sales-by-customer-routing.module';
import { SalesByCustomerComponent } from './sales-by-customer.component';


@NgModule({
  declarations: [
    SalesByCustomerComponent
  ],
  imports: [
    CommonModule,
    SalesByCustomerRoutingModule,
    MaterialModule
  ]
})
export class SalesByCustomerModule { }
