import { NzTableModule } from 'ng-zorro-antd/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllInvoiceRoutingModule } from './all-invoice-routing.module';
import { AllInvoiceComponent } from './all-invoice.component';
import { MaterialModule } from 'src/app/material/material.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';

@NgModule({
  declarations: [AllInvoiceComponent],
  imports: [
    CommonModule,
    AllInvoiceRoutingModule,
    MaterialModule,
    NgxPaginationModule,
    NzTableModule,
    PipesModule,
    NzInputModule,
    NzTabsModule,
    NzCardModule,
    NzSelectModule,
  ],
})
export class AllInvoiceModule {}
