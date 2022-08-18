import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllCollectionRoutingModule } from './all-collection-routing.module';
import { AllCollectionComponent } from './all-collection.component';


@NgModule({
  declarations: [
    AllCollectionComponent
  ],
  imports: [
    CommonModule,
    AllCollectionRoutingModule,
    MaterialModule,
    SwiperModule
  ]
})
export class AllCollectionModule { }
