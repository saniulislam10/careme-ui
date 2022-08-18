import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionRateComponent } from './conversion-rate.component';
import { ConversionRateRoutingModule } from './conversion-rate-routing.module';
import { MaterialModule } from 'src/app/material/material.module';
import { AddConversionRateComponent } from './add-conversion-rate/add-conversion-rate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule, Routes } from '@angular/router';



@NgModule({
  declarations: [ConversionRateComponent, AddConversionRateComponent],
  imports: [
    CommonModule,
    ConversionRateRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule,
  ],
})
export class ConversionRateModule {}
