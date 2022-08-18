import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivationRoutingModule } from './activation-routing.module';
import { ActivationComponent } from './activation.component';


@NgModule({
  declarations: [
    ActivationComponent
  ],
  imports: [
    CommonModule,
    ActivationRoutingModule,
    MaterialModule
  ]
})
export class ActivationModule { }
