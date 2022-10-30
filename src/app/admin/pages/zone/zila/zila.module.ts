import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ZilaRoutingModule } from './zila-routing.module';
import { ZilaComponent } from './zila.component';
import { AddZilaComponent } from './add-zila/add-zila.component';
import { ThanaRoutingModule } from '../thana/thana-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [ZilaComponent, AddZilaComponent],
  imports: [
    CommonModule,
    ZilaRoutingModule,
    CommonModule,
    ThanaRoutingModule,
    MaterialModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AntModule,
  ],
})
export class ZilaModule {}
