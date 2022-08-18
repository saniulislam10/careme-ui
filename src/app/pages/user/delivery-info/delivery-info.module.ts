import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryInfoRoutingModule } from './delivery-info-routing.module';
import { DeliveryInfoComponent } from './delivery-info.component';


@NgModule({
  declarations: [
    DeliveryInfoComponent
  ],
  imports: [
    CommonModule,
    DeliveryInfoRoutingModule,
    MaterialModule
  ]
})
export class DeliveryInfoModule { }
