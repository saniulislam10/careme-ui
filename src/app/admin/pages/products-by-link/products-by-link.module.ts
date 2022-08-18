import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsByLinkRoutingModule } from './products-by-link-routing.module';
import { ProductsByLinkComponent } from './products-by-link.component';
import { ProductsRoutingModule } from '../products/products-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductCardAdminModule } from 'src/app/shared/lazy-component/product-card-admin/product-card-admin.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ExportPopupComponent } from './export-popup/export-popup.component';


@NgModule({
  declarations: [
    ProductsByLinkComponent,
    ExportPopupComponent
  ],
  imports: [
    CommonModule,
    ProductsByLinkRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    NgxPaginationModule,
    ProductCardAdminModule,
    FormsModule,
    PipesModule,
    NgxSpinnerModule,
  ]
})
export class ProductsByLinkModule { }
