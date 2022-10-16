import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';
import { CouponComponent } from './coupon.component';
import { AntModule } from 'src/app/material/ant.module';
import { CreateCouponComponent } from './create-coupon/create-coupon.component';

@NgModule({
  declarations: [CouponComponent, CreateCouponComponent],
  imports: [CommonModule, CouponRoutingModule, MaterialModule, AntModule],
})
export class CouponModule {}
