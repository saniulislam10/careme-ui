import { ProductCardOneModule } from './../../shared/lazy-component/product-card-one/product-card-one.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchResultRoutingModule } from './search-result-routing.module';
import { SearchResultComponent } from './search-result.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SearchResultComponent
  ],
  imports: [
    CommonModule,
    SearchResultRoutingModule,
    ProductCardOneModule,
    MaterialModule,
    FormsModule
  ]
})
export class SearchResultModule { }
