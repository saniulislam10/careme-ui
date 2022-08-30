import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReviewsRoutingModule } from './my-reviews-routing.module';
import { MyReviewsComponent } from './my-reviews.component';


@NgModule({
  declarations: [
    MyReviewsComponent
  ],
  imports: [
    CommonModule,
    MyReviewsRoutingModule
  ]
})
export class MyReviewsModule { }
