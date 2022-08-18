import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagRoutingModule } from './tag-routing.module';
import { TagComponent } from './tag.component';
import { MaterialModule } from 'src/app/material/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './image-cropper/image-crop.component';


@NgModule({
  declarations: [
    TagComponent,
    ImageCropperComponent
  ],
  imports: [
    CommonModule,
    TagRoutingModule,
    MaterialModule,
    ImageCropperModule
  ]
})
export class TagModule { }
