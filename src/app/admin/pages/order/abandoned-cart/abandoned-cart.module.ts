import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AbandonedCartRoutingModule } from './abandoned-cart-routing.module';
import { AbandonedCartComponent } from './abandoned-cart.component';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [AbandonedCartComponent],
  imports: [
    CommonModule,
    AbandonedCartRoutingModule,
    MaterialModule,
    AntModule,
  ],
})
export class AbandonedCartModule {}
