import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [
    CategoryComponent,
    AddCategoryComponent,
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
  ]
})
export class CategoryModule { }
