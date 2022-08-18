import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductsListComponent } from './products-list.component';

const routes: Routes = [
  {path: '', component: ProductsListComponent},
  {path: ':categorySlug', component: ProductsListComponent},
  {path: ':categorySlug/:subCategorySlug', component: ProductsListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsListRoutingModule { }
