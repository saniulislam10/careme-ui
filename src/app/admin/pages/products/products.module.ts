import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductsRoutingModule} from './products-routing.module';
import {ProductsComponent} from './products.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductCardAdminModule} from '../../../shared/lazy-component/product-card-admin/product-card-admin.module';
import {FormsModule} from '@angular/forms';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import { AddNewProductComponent } from './add-new-product/add-new-product.component';
import { ExportPopupComponent } from './export-popup/export-popup.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ExportPopupComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgxPaginationModule,
    ProductCardAdminModule,
    FormsModule,
    PipesModule,
    NgxSpinnerModule,
  ]
})
export class ProductsModule {
}
