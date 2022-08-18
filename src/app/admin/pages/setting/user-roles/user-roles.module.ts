import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRolesRoutingModule } from './user-roles-routing.module';
import { UserRolesComponent } from './user-roles.component';
import { InviteUserComponent } from './invite-user/invite-user.component';


@NgModule({
  declarations: [
    UserRolesComponent,
    InviteUserComponent
  ],
  imports: [
    CommonModule,
    UserRolesRoutingModule,
    MaterialModule
  ]
})
export class UserRolesModule { }
