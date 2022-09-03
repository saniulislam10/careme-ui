import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@NgModule({
  declarations: [
    SummaryComponent
  ],
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTableModule,
    NzMessageModule,
    NzEmptyModule,
    PipesModule,
    SummaryRoutingModule
  ]
})
export class SummaryModule { }
