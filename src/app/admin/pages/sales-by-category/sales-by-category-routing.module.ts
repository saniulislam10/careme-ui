import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesByCategoryComponent } from './sales-by-category.component';

const routes: Routes = [
  {
    path:"",
    component:SalesByCategoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesByCategoryRoutingModule { }
