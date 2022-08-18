import { MaterialModule } from '../../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllCustomersRoutingModule } from './all-customers-routing.module';
import { AllCustomersComponent } from './all-customers.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
// import { ExportPopupComponent } from '../../order/regular-orders/export-popup/export-popup.component';
import { RegularOrdersModule } from '../../order/regular-orders/regular-orders.module';
import { ExportPopupComponent } from './export-popup/export-popup.component';


@NgModule({
  declarations: [
    AllCustomersComponent,
    ExportPopupComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    AllCustomersRoutingModule,
    MaterialModule,
    FormsModule,
    // RegularOrdersModule
  ]
})
export class AllCustomersModule { }
