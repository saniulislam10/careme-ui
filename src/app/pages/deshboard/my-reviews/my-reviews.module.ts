
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReviewsRoutingModule } from './my-reviews-routing.module';
import { MyReviewsComponent } from './my-reviews.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';


@NgModule({
  declarations: [
    MyReviewsComponent
  ],
  imports: [
    CommonModule,
    NzTabsModule,
    NzTableModule,
    NzDropDownModule,
    MatTooltipModule,
    MyReviewsRoutingModule
  ]
})
export class MyReviewsModule { }
