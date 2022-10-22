import { ShippingComponent } from './shipping.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateShippingZoneComponent } from './create-shipping-zone/create-shipping-zone.component';
import { MethodsComponent } from './methods/methods.component';

const routes: Routes = [
  {
    path: '',
    component: ShippingComponent,
  },
  {
    path: 'add',
    component: CreateShippingZoneComponent,
  },
  {
    path: 'methods',
    component: MethodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShippingRoutingModule {}
