import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsSearchComponent } from './product-details-search.component';
import { ProductDetailsRoutingModule } from './product-details-routing-search.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material/material.module';
import { SwiperModule } from 'swiper/angular';
import { ProductCardOneModule } from 'src/app/shared/lazy-component/product-card-one/product-card-one.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductRatingViewModule } from 'src/app/shared/lazy-component/product-rating-view/product-rating-view.module';



@NgModule({
  declarations: [
    ProductDetailsSearchComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    MatDialogModule,
    MaterialModule,
    SwiperModule,
    ProductCardOneModule,
    PipesModule,
    NgxSpinnerModule,
    ProductRatingViewModule

  ]
})
export class ProductDetailsSearchModule { }
