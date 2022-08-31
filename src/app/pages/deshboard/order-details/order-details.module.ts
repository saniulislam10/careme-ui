import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsComponent } from './order-details.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';


@NgModule({
  declarations: [
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    NzTableModule,
    NzListModule,
    NzGridModule,
    NzDividerModule,
    OrderDetailsRoutingModule
  ]
})
export class OrderDetailsModule { }
