import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesByCategoryRoutingModule } from './sales-by-category-routing.module';
import { SalesByCategoryComponent } from './sales-by-category.component';


@NgModule({
  declarations: [
    SalesByCategoryComponent
  ],
  imports: [
    CommonModule,
    SalesByCategoryRoutingModule,
    MaterialModule
  ]
})
export class SalesByCategoryModule { }
