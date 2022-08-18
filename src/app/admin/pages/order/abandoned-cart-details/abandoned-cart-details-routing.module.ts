import { AbandonedCartDetailsComponent } from './abandoned-cart-details.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:":id",
    component:AbandonedCartDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AbandonedCartDetailsRoutingModule { }
