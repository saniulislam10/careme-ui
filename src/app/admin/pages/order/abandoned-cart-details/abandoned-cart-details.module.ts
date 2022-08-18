import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbandonedCartDetailsRoutingModule } from './abandoned-cart-details-routing.module';
import { AbandonedCartDetailsComponent } from './abandoned-cart-details.component';


@NgModule({
  declarations: [
    AbandonedCartDetailsComponent
  ],
  imports: [
    CommonModule,
    AbandonedCartDetailsRoutingModule,
    MaterialModule
  ]
})
export class AbandonedCartDetailsModule { }
