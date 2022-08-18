import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductFeedRoutingModule } from './product-feed-routing.module';
import { ProductFeedComponent } from './product-feed.component';
import { ProductFeedPixelComponent } from './product-feed-pixel/product-feed-pixel.component';
import { ProductFeedSettingComponent } from './product-feed-setting/product-feed-setting.component';


@NgModule({
  declarations: [
    ProductFeedComponent,
    ProductFeedPixelComponent,
    ProductFeedSettingComponent
  ],
  imports: [
    CommonModule,
    ProductFeedRoutingModule,
    MaterialModule
  ]
})
export class ProductFeedModule { }
