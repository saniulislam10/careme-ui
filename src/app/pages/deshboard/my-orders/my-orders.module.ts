import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { MyOrdersComponent } from './my-orders.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import {MatTooltipModule} from '@angular/material/tooltip';


@NgModule({
  declarations: [
    MyOrdersComponent
  ],
  imports: [
    CommonModule,
    NzTabsModule,
    NzTableModule,
    NzDropDownModule,
    MatTooltipModule,
    NzToolTipModule,
    MyOrdersRoutingModule,
  ]
})
export class MyOrdersModule { }
