import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponPerformanceRoutingModule } from './coupon-performance-routing.module';
import { CouponPerformanceComponent } from './coupon-performance.component';


@NgModule({
  declarations: [
    CouponPerformanceComponent
  ],
  imports: [
    CommonModule,
    CouponPerformanceRoutingModule,
    MaterialModule
  ]
})
export class CouponPerformanceModule { }
