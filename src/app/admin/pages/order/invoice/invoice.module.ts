import { AntModule } from './../../../../material/ant.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';

import { MaterialModule } from 'src/app/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MaterialModule,
    AntModule,
    NgxSpinnerModule,
    NgxPrintModule
  ],
})
export class InvoiceModule {}
