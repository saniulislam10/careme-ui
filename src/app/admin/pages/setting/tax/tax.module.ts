import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';


@NgModule({
  declarations: [
    TaxComponent
  ],
  imports: [
    CommonModule,
    TaxRoutingModule,
    MaterialModule
  ]
})
export class TaxModule { }
