import { PipesModule } from 'src/app/shared/pipes/pipes.module';
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
    PipesModule
  ]
})
export class OrderSuccessModule { }
