import { OrderDetailsComponent } from './order-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditOrderComponent } from './edit-order/edit-order.component';

const routes: Routes = [
  {
    path:":id",
    component:OrderDetailsComponent
  },
  // {
  //   path:":id",
  //   component:OrderDetailsComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderDetailsRoutingModule { }
