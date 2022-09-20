import { NzImageModule } from 'ng-zorro-antd/image';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';


@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule,
    MaterialModule,
    SwiperModule,
    PipesModule,
    FormsModule,
    NzModalModule,
    NzTableModule,
    NzButtonModule,
    NzSelectModule,
    NzImageModule
  ]
})
export class CartModule { }
