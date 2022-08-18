import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestProductRoutingModule } from './request-product-routing.module';
import { RequestProductComponent } from './request-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    RequestProductComponent
  ],
  imports: [
    CommonModule,
    RequestProductRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class RequestProductModule { }
