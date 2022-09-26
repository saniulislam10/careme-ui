import { SharedModule } from 'src/app/shared/shared.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnPageRoutingModule } from './return-page-routing.module';
import { ReturnPageComponent } from './return-page.component';


@NgModule({
  declarations: [
    ReturnPageComponent
  ],
  imports: [
    CommonModule,
    ReturnPageRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class ReturnPageModule { }
