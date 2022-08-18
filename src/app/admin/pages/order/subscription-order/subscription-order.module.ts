import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionOrderRoutingModule } from './subscription-order-routing.module';
import { SubscriptionOrderComponent } from './subscription-order.component';


@NgModule({
  declarations: [
    SubscriptionOrderComponent
  ],
  imports: [
    CommonModule,
    SubscriptionOrderRoutingModule,
    MaterialModule
  ]
})
export class SubscriptionOrderModule { }
