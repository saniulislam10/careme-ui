import { MenuHoverContentComponent } from './menu-hover-content/menu-hover-content.component';
import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ProductCardOneModule } from 'src/app/shared/lazy-component/product-card-one/product-card-one.module';
import { ProductCardTwoModule } from 'src/app/shared/lazy-component/product-card-two/product-card-two.module';
import { ProductCardThreeModule } from 'src/app/shared/lazy-component/product-card-three/product-card-three.module';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { AntModule } from 'src/app/material/ant.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';

@NgModule({
  declarations: [HomeComponent, MenuHoverContentComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule,
    SwiperModule,
    ProductCardOneModule,
    ProductCardTwoModule,
    ProductCardThreeModule,
    NzStatisticModule,
    AntModule,
    PipesModule
  ],
})
export class HomeModule {}
