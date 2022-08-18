import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnPageRoutingModule } from './return-page-routing.module';
import { ReturnPageComponent } from './return-page.component';
import { CreateReturnComponent } from './create-return/create-return.component';


@NgModule({
  declarations: [
    ReturnPageComponent,
    CreateReturnComponent
  ],
  imports: [
    CommonModule,
    ReturnPageRoutingModule,
    MaterialModule
  ]
})
export class ReturnPageModule { }
