import { OrderSingleProductDetailsComponent } from './order-single-product-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:":id/:index",
    component: OrderSingleProductDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderSingleProductDetailsRoutingModule { }
