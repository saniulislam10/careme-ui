import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReturnRoutingModule } from './my-return-routing.module';
import { MyReturnComponent } from './my-return.component';


@NgModule({
  declarations: [
    MyReturnComponent
  ],
  imports: [
    CommonModule,
    MyReturnRoutingModule
  ]
})
export class MyReturnModule { }
