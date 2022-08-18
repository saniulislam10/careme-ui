import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRoutingModule } from './shipping-routing.module';
import { ShippingComponent } from './shipping.component';
import { AddCourierComponent } from './add-courier/add-courier.component';
import { CreateShippingZoneComponent } from './create-shipping-zone/create-shipping-zone.component';

@NgModule({
  declarations: [
    ShippingComponent,
    AddCourierComponent,
    CreateShippingZoneComponent
  ],
  imports: [
    CommonModule,
    ShippingRoutingModule,
    MaterialModule,
  ]
})
export class ShippingModule { }
