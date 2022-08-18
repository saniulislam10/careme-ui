import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockControlRoutingModule } from './stock-control-routing.module';
import { StockControlComponent } from './stock-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    StockControlComponent
  ],
  imports: [
    CommonModule,
    StockControlRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class StockControlModule { }
