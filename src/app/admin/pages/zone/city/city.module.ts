import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { AddCityComponent } from './add-city/add-city.component';


// import {MaterialModule} from '../../../material/material.module';
// import {SharedModule} from '../../../shared/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CityComponent,
    AddCityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule,
    MaterialModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CityModule { }
