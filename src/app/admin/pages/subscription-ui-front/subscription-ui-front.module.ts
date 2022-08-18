import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionUiFrontRoutingModule } from './subscription-ui-front-routing.module';
import { SubscriptionUiFrontComponent } from './subscription-ui-front.component';
import { SubscriptionUiPopupComponent } from './subscription-ui-popup/subscription-ui-popup.component';


@NgModule({
  declarations: [
    SubscriptionUiFrontComponent,
    SubscriptionUiPopupComponent
  ],
  imports: [
    CommonModule,
    SubscriptionUiFrontRoutingModule,
    MaterialModule,
    FormsModule
  ]
})
export class SubscriptionUiFrontModule { }
