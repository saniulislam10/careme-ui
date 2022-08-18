import { ShippingPolicyComponent } from './shipping-policy.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
   path:"",
   component:ShippingPolicyComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingPolicyRoutingModule { }
