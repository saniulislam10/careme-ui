import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingInfoRoutingModule } from './shipping-info-routing.module';
import { ShippingInfoComponent } from './shipping-info.component';
import { AddAddressComponent } from './add-address/add-address.component';


@NgModule({
  declarations: [
    ShippingInfoComponent,
    AddAddressComponent
  ],
  imports: [
    CommonModule,
    ShippingInfoRoutingModule,
    MaterialModule
  ]
})
export class ShippingInfoModule { }
