import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';
import { CouponComponent } from './coupon.component';

@NgModule({
  declarations: [CouponComponent],
  imports: [CommonModule, CouponRoutingModule, MaterialModule],
})
export class CouponModule {}
