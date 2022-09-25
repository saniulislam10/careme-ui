import { NzTableModule } from 'ng-zorro-antd/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllInvoiceRoutingModule } from './all-invoice-routing.module';
import { AllInvoiceComponent } from './all-invoice.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';




@NgModule({
  declarations: [
    AllInvoiceComponent,
  ],
  imports: [
    CommonModule,
    AllInvoiceRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    NzTableModule,
    PipesModule
  ]
})
export class AllInvoiceModule { }
