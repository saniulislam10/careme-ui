import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndividualProductOrderDetailsRoutingModule } from './individual-product-order-details-routing.module';
import { IndividualProductOrderDetailsComponent } from './individual-product-order-details.component';


@NgModule({
  declarations: [
    IndividualProductOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    IndividualProductOrderDetailsRoutingModule
  ]
})
export class IndividualProductOrderDetailsModule { }
