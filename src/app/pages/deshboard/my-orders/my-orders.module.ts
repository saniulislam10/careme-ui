import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { MyOrdersComponent } from './my-orders.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@NgModule({
  declarations: [MyOrdersComponent],
  imports: [
    CommonModule,
    NzTabsModule,
    NzTableModule,
    NzDropDownModule,
    MatTooltipModule,
    NzCardModule,
    NzGridModule,
    NzMessageModule,
    NzEmptyModule,
    PipesModule,
    NzInputModule,
    MyOrdersRoutingModule,
    NzStatisticModule,
  ],
})
export class MyOrdersModule {}
