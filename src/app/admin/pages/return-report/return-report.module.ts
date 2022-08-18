import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnReportRoutingModule } from './return-report-routing.module';
import { ReturnReportComponent } from './return-report.component';


@NgModule({
  declarations: [
    ReturnReportComponent
  ],
  imports: [
    CommonModule,
    ReturnReportRoutingModule,
    MaterialModule
  ]
})
export class ReturnReportModule { }
