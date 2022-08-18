import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionPageRoutingModule } from './subscription-page-routing.module';
import { SubscriptionPageComponent } from './subscription-page.component';


@NgModule({
  declarations: [
    SubscriptionPageComponent
  ],
  imports: [
    CommonModule,
    SubscriptionPageRoutingModule,
    MaterialModule
  ]
})
export class SubscriptionPageModule { }
