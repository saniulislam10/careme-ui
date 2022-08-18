import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddByLinkRoutingModule } from './add-by-link-routing.module';
import { AddByLinkComponent } from './add-by-link.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { QuillModule } from 'ngx-quill';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    AddByLinkComponent
  ],
  imports: [
    CommonModule,
    AddByLinkRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    QuillModule.forRoot(),
    MatSelectFilterModule,
  ]
})
export class AddByLinkModule { }
