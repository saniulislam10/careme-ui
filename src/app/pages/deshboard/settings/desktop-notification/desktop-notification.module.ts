import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesktopNotificationRoutingModule } from './desktop-notification-routing.module';
import { DesktopNotificationComponent } from './desktop-notification.component';


@NgModule({
  declarations: [
    DesktopNotificationComponent
  ],
  imports: [
    CommonModule,
    DesktopNotificationRoutingModule,
    MaterialModule
  ]
})
export class DesktopNotificationModule { }
