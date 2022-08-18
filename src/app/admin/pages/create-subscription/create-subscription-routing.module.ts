import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSubscriptionComponent } from './create-subscription.component';

const routes: Routes = [
  {
    path:"",
    component:CreateSubscriptionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSubscriptionRoutingModule { }
