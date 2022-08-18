import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewRoleRoutingModule } from './new-role-routing.module';
import { NewRoleComponent } from './new-role.component';


@NgModule({
  declarations: [
    NewRoleComponent
  ],
  imports: [
    CommonModule,
    NewRoleRoutingModule,
    MaterialModule
  ]
})
export class NewRoleModule { }
