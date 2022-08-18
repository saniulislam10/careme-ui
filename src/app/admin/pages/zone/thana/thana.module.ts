import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThanaRoutingModule } from './thana-routing.module';
import { ThanaComponent } from './thana.component';
import { AddThanaComponent } from './add-thana/add-thana.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    ThanaComponent,
    AddThanaComponent
  ],
  imports: [
    CommonModule,
    ThanaRoutingModule,
    
   
    MaterialModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ThanaModule { }
