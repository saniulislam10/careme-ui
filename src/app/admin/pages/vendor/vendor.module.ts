import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorRoutingModule } from './vendor-routing.module';
import { VendorComponent } from './vendor.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    VendorComponent
  ],
  imports: [
    CommonModule,
    VendorRoutingModule,
    NzInputModule,
    NzSkeletonModule,
    NzIconModule,
    FormsModule,
    MaterialModule
  ]
})
export class VendorModule { }
