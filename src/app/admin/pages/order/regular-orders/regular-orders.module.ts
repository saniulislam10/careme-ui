import {NzTableModule} from 'ng-zorro-antd/table';
import {MaterialModule} from 'src/app/material/material.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RegularOrdersRoutingModule} from './regular-orders-routing.module';
import {RegularOrdersComponent} from './regular-orders.component';
import {ExportPopupComponent} from './export-popup/export-popup.component';
import {PipesModule} from 'src/app/shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import {CreateOrderDialogComponent} from './create-order-dialog/create-order-dialog.component';
import {AntModule} from "../../../../material/ant.module";


@NgModule({
  declarations: [
    RegularOrdersComponent,
    ExportPopupComponent,
    CreateOrderDialogComponent
  ],
  imports: [
    CommonModule,
    RegularOrdersRoutingModule,
    MaterialModule,
    NzTableModule,
    PipesModule,
    NgxPaginationModule,
    MaterialModule,
    FormsModule,
    AntModule
  ],

})
export class RegularOrdersModule {
}
