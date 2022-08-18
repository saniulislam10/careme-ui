import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbandonedCartRoutingModule } from './abandoned-cart-routing.module';
import { AbandonedCartComponent } from './abandoned-cart.component';


@NgModule({
  declarations: [
    AbandonedCartComponent
  ],
  imports: [
    CommonModule,
    AbandonedCartRoutingModule,
    MaterialModule
  ]
})
export class AbandonedCartModule { }
