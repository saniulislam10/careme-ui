import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewProductComponent } from './add-new-product.component';
// import {AddProductComponent} from './add-product.component';

const routes: Routes = [
  {path: '', component: AddNewProductComponent},
  {path: ':id', component: AddNewProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddProductRoutingModule { }
