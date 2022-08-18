import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogBoxComponent} from './dialog-box.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ReactiveFormsModule} from '@angular/forms';
import {DigitOnlyModule} from "@uiowa/digit-only";



@NgModule({
  declarations: [
    DialogBoxComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DigitOnlyModule,
    MaterialModule
  ],
  exports: [
    DialogBoxComponent
  ]
})
export class DialogBoxModule { }
