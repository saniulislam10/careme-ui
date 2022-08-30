import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import { DetailsComponent } from './details/details.component';
import { RecievedComponent } from './recieved/recieved.component';
import { CreateNewComponent } from '../adjustment/create-new/create-new.component';
import { CreateNewPurchaseComponent } from './create-new-purchase/create-new-purchase.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    ExportPopupComponent,
    CreateNewPurchaseComponent,
    DetailsComponent,
    RecievedComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    PipesModule
  ]
})
export class PurchaseModule { }
