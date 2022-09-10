import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    NzCardModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    ImageCropperModule,
    NzSpaceModule,
    NzSelectModule,
    NzButtonModule,
  ],
})
export class MyAccountModule {}
