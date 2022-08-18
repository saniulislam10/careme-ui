import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsListRoutingModule } from './products-list-routing.module';
import { ProductsListComponent } from './products-list.component';
import { ProductCardOneModule } from 'src/app/shared/lazy-component/product-card-one/product-card-one.module';
import { MenuHoverContentComponent } from './menu-hover-content/menu-hover-content.component';


@NgModule({
  declarations: [
    ProductsListComponent,
    MenuHoverContentComponent
  ],
  imports: [
    CommonModule,
    ProductsListRoutingModule,
    ProductCardOneModule,
  ]
})
export class ProductsListModule { }
