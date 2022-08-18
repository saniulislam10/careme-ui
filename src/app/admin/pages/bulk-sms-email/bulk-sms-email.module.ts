import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulkSmsEmailRoutingModule } from './bulk-sms-email-routing.module';
import { BulkSmsEmailComponent } from './bulk-sms-email.component';
import { CreateSmsGroupComponent } from './create-sms-group/create-sms-group.component';


@NgModule({
  declarations: [
    BulkSmsEmailComponent,
    CreateSmsGroupComponent
  ],
  imports: [
    CommonModule,
    BulkSmsEmailRoutingModule,
    MaterialModule
  ]
})
export class BulkSmsEmailModule { }
