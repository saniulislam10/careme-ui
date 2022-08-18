import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsByLinkComponent } from './products-by-link.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsByLinkComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsByLinkRoutingModule { }
