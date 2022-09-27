import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';

import { MaterialModule } from 'src/app/material/material.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    InvoiceComponent
  ],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class InvoiceModule { }
