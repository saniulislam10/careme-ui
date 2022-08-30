import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNewPurchaseComponent } from './create-new-purchase/create-new-purchase.component';
import { DetailsComponent } from './details/details.component';
import { PurchaseComponent } from './purchase.component';

const routes: Routes = [
  {
    path:"",
    component: PurchaseComponent
  },
  {
    path:"create",
    component: CreateNewPurchaseComponent
  },
  {
    path:"details/:id",
    component: DetailsComponent
  },
  {
    path:"edit/:id",
    component: CreateNewPurchaseComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
