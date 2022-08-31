import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsComponent } from './order-details.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatTooltipModule } from '@angular/material/tooltip';


@NgModule({
  declarations: [
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    NzTableModule,
    OrderDetailsRoutingModule
  ]
})
export class OrderDetailsModule { }
