import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeshboardRoutingModule } from './deshboard-routing.module';
import { DeshboardComponent } from './deshboard.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';


@NgModule({
  declarations: [
    DeshboardComponent
  ],
  imports: [
    CommonModule,
    DeshboardRoutingModule,
    NzMenuModule,
    NzIconModule
  ]
})
export class DeshboardModule { }
