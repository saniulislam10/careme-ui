import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerProfileRoutingModule } from './customer-profile-routing.module';
import { CustomerProfileComponent } from './customer-profile.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [CustomerProfileComponent],
  imports: [
    CommonModule,
    CustomerProfileRoutingModule,
    MaterialModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    AntModule,
  ],
})
export class CustomerProfileModule {}
