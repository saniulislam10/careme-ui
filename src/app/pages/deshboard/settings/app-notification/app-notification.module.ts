import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppNotificationRoutingModule } from './app-notification-routing.module';
import { AppNotificationComponent } from './app-notification.component';


@NgModule({
  declarations: [
    AppNotificationComponent
  ],
  imports: [
    CommonModule,
    AppNotificationRoutingModule,
    MaterialModule
  ]
})
export class AppNotificationModule { }
