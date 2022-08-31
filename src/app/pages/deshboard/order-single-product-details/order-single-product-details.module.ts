import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSingleProductDetailsRoutingModule } from './order-single-product-details-routing.module';
import { OrderSingleProductDetailsComponent } from './order-single-product-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';


@NgModule({
  declarations: [
    OrderSingleProductDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    NzTableModule,
    NzListModule,
    NzGridModule,
    NzDividerModule,
    NzStepsModule,
    NzTimelineModule,
    OrderSingleProductDetailsRoutingModule
  ]
})
export class OrderSingleProductDetailsModule { }
