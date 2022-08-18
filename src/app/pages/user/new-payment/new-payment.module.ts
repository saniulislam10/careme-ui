import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewPaymentRoutingModule } from './new-payment-routing.module';
import { NewPaymentComponent } from './new-payment.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    NewPaymentComponent
  ],
  imports: [
    CommonModule,
    NewPaymentRoutingModule,
   MatCheckboxModule
  ]
})
export class NewPaymentModule {

 }
