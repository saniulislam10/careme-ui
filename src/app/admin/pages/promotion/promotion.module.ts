import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionComponent } from './promotion.component';


@NgModule({
  declarations: [
    PromotionComponent
  ],
  imports: [
    CommonModule,
    PromotionRoutingModule,
    MaterialModule
  ]
})
export class PromotionModule { }
