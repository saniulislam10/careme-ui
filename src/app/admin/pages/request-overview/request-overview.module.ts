import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestOverviewRoutingModule } from './request-overview-routing.module';
import { RequestOverviewComponent } from './request-overview.component';


@NgModule({
  declarations: [
    RequestOverviewComponent
  ],
  imports: [
    CommonModule,
    RequestOverviewRoutingModule
  ]
})
export class RequestOverviewModule { }
