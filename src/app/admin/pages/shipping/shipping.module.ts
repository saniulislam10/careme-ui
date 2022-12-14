import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRoutingModule } from './shipping-routing.module';
import { ShippingComponent } from './shipping.component';
import { CreateShippingZoneComponent } from './create-shipping-zone/create-shipping-zone.component';
import { AntModule } from 'src/app/material/ant.module';
import { MethodsComponent } from './methods/methods.component';

@NgModule({
  declarations: [
    ShippingComponent,
    CreateShippingZoneComponent,
    MethodsComponent,
  ],
  imports: [CommonModule, ShippingRoutingModule, MaterialModule, AntModule],
})
export class ShippingModule {}
