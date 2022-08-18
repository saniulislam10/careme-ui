import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsNotificationRoutingModule } from './sms-notification-routing.module';
import { SmsNotificationComponent } from './sms-notification.component';


@NgModule({
  declarations: [
    SmsNotificationComponent
  ],
  imports: [
    CommonModule,
    SmsNotificationRoutingModule,
    MaterialModule
  ]
})
export class SmsNotificationModule { }
