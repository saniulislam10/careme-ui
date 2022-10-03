import { AntModule } from 'src/app/material/ant.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSingleProductDetailsRoutingModule } from './order-single-product-details-routing.module';
import { OrderSingleProductDetailsComponent } from './order-single-product-details.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [OrderSingleProductDetailsComponent],
  imports: [
    CommonModule,
    OrderSingleProductDetailsRoutingModule,
    NzCardModule,
    NzTableModule,
    NzStepsModule,
    NzTimelineModule,
    NzIconModule,
    AntModule
  ],
})
export class OrderSingleProductDetailsModule {}
