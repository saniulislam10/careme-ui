import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AntModule } from 'src/app/material/ant.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackOrderComponent } from './track-order.component';
import { TrackOrderRoutingModule } from './track-order-routing.module';
@NgModule({
  declarations: [TrackOrderComponent],
  imports: [
    CommonModule,
    TrackOrderRoutingModule,
    PipesModule,
    AntModule
  ],
})
export class TrackOrderModule {}
