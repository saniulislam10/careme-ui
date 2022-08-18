import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDetailsRoutingModule } from './user-details-routing.module';
import { UserDetailsComponent } from './user-details.component';
import { EditUserComponent } from './edit-user/edit-user.component';


@NgModule({
  declarations: [
    UserDetailsComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    UserDetailsRoutingModule,
    MaterialModule
  ]
})
export class UserDetailsModule { }
