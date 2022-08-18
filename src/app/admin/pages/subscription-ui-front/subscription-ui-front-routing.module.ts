import { SubscriptionUiFrontComponent } from './subscription-ui-front.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component:SubscriptionUiFrontComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubscriptionUiFrontRoutingModule { }
