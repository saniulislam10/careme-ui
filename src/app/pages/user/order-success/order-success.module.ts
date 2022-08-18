import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderSuccessRoutingModule } from './order-success-routing.module';
import { OrderSuccessComponent } from './order-success.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@NgModule({
  declarations: [
    OrderSuccessComponent
  ],
  imports: [
    CommonModule,
    OrderSuccessRoutingModule,
    MatCheckboxModule,
    NzTableModule,
    NzCheckboxModule
  ]
})
export class OrderSuccessModule { }
