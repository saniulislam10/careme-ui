import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestOrderRoutingModule } from './request-order-routing.module';
import { RequestOrderComponent } from './request-order.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ExportPopupComponent } from './export-popup/export-popup.component';


@NgModule({
  declarations: [
    RequestOrderComponent,
    CreateOrderComponent,
    ExportPopupComponent
  ],
  imports: [
    CommonModule,
    RequestOrderRoutingModule,
    MaterialModule,
    PipesModule,
    NgxPaginationModule,
    MaterialModule,
    FormsModule,
  ]
})
export class RequestOrderModule { }
