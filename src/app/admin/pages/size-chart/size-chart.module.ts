import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SizeChartRoutingModule } from './size-chart-routing.module';
import { SizeChartComponent } from './size-chart.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/image-crop.component';


@NgModule({
  declarations: [
    SizeChartComponent,
    ImageCropperComponent,
  ],
  imports: [
    CommonModule,
    SizeChartRoutingModule,
    MaterialModule,
    ImageCropperModule
  ]
})
export class SizeChartModule { }
