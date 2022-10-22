import { ShippingComponent } from './shipping.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateShippingZoneComponent } from './create-shipping-zone/create-shipping-zone.component';

const routes: Routes = [
  {
    path:"",
    component:ShippingComponent
  },
  {
    path:"add",
    component: CreateShippingZoneComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule { }
