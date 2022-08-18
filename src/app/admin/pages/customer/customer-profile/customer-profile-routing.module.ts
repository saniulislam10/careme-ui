import { CustomerProfileComponent } from './customer-profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:":id",
    component:CustomerProfileComponent
  },
  // {
  //   path:"",
  //   component:CustomerProfileComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerProfileRoutingModule { }
