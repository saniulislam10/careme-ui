import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PointsRoutingModule } from './points-routing.module';
import { PointsComponent } from './points.component';


@NgModule({
  declarations: [
    PointsComponent
  ],
  imports: [
    CommonModule,
    PointsRoutingModule,
    MaterialModule
  ]
})
export class PointsModule { }
