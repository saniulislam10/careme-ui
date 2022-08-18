import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestDetailsRoutingModule } from './request-details-routing.module';
import { RequestDetailsComponent } from './request-details.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateInvoiceReturnComponent } from './create-invoice-return/create-invoice-return.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    RequestDetailsComponent,
    CreateInvoiceReturnComponent,
    CreateInvoiceComponent
  ],
  imports: [
    CommonModule,
    RequestDetailsRoutingModule,
    FormsModule,
    MaterialModule,
    MaterialModule,
    PipesModule,
    MatFormFieldModule
  ]
})
export class RequestDetailsModule { }
