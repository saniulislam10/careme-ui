import { AntModule } from 'src/app/material/ant.module';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    MaterialModule,
    SwiperModule,
    PipesModule,
    FormsModule,
    AntModule,
  ],
})
export class CartModule {}
