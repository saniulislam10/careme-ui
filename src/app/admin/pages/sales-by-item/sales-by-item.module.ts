import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesByItemRoutingModule } from './sales-by-item-routing.module';
import { SalesByItemComponent } from './sales-by-item.component';


@NgModule({
  declarations: [
    SalesByItemComponent
  ],
  imports: [
    CommonModule,
    SalesByItemRoutingModule,
    MaterialModule
  ]
})
export class SalesByItemModule { }
