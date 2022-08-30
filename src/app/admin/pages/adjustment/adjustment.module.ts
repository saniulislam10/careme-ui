import { SharedModule } from 'src/app/shared/shared.module';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';

import { AdjustmentRoutingModule } from './adjustment-routing.module';
import { AdjustmentComponent } from './adjustment.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateNewComponent } from './create-new/create-new.component';
import { MatInputModule } from '@angular/material/input';
import { DetailsComponent } from './details/details.component';


@NgModule({
  declarations: [
    AdjustmentComponent,
    CreateNewComponent,
    ExportPopupComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    AdjustmentRoutingModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    PipesModule,
    MatInputModule,
    NzTableModule,
    SharedModule
  ]
})
export class AdjustmentModule { }
