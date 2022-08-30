import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';

@NgModule({
  declarations: [
    SummaryComponent
  ],
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTableModule,
    SummaryRoutingModule
  ]
})
export class SummaryModule { }
