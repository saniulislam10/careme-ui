import { PipesModule } from './../../../shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import { DetailsComponent } from './details/details.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzRadioModule } from 'ng-zorro-antd/radio';


@NgModule({
  declarations: [
    StockComponent,
    ExportPopupComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    PipesModule,
    NzTabsModule,
    NzRadioModule
  ]
})
export class StockModule { }
