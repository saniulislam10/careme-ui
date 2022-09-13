import { NzButtonModule } from 'ng-zorro-antd/button';
import { MaterialModule } from 'src/app/material/material.module';
import { NzInputModule } from 'ng-zorro-antd/input';
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
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzImageModule } from 'ng-zorro-antd/image';


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
    NzModalModule,
    NzInputModule,
    NzButtonModule,
    NzTimelineModule,
    NzImageModule,
    PipesModule,
    MaterialModule,
    OrderSingleProductDetailsRoutingModule
  ]
})
export class OrderSingleProductDetailsModule { }
