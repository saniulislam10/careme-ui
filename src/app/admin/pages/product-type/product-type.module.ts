import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductTypeRoutingModule } from './product-type-routing.module';
import { ProductTypeComponent } from './product-type.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ProductTypeComponent
  ],
  imports: [
    CommonModule,
    ProductTypeRoutingModule,
    MaterialModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,
    NzTableModule,
    ReactiveFormsModule
  ]
})
export class ProductTypeModule { }
