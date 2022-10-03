import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDetailsRoutingModule } from './order-details-routing.module';
import { OrderDetailsComponent } from './order-details.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { CreateInvoiceReturnComponent } from './create-invoice-return/create-invoice-return.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import {AntModule} from "../../../../material/ant.module";


@NgModule({
  declarations: [
    OrderDetailsComponent,
    CreateInvoiceComponent,
    CreateInvoiceReturnComponent,
    EditOrderComponent
  ],
  imports: [
    CommonModule,
    OrderDetailsRoutingModule,
    MaterialModule,
    PipesModule,
    MatFormFieldModule,
    FormsModule,
    NzImageModule,
    NzTableModule,
    NzButtonModule,
    NzSelectModule,
    NzInputModule,
    NgxPaginationModule,
    AntModule,
  ]
})
export class OrderDetailsModule { }
