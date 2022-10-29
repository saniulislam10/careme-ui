import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [ReviewsComponent],
  imports: [CommonModule, ReviewsRoutingModule, MaterialModule, AntModule],
})
export class ReviewsModule {}
