import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSubscriptionRoutingModule } from './create-subscription-routing.module';
import { CreateSubscriptionComponent } from './create-subscription.component';
import { EditOptionComponent } from './edit-option/edit-option.component';


@NgModule({
  declarations: [
    CreateSubscriptionComponent,
    EditOptionComponent
  ],
  imports: [
    CommonModule,
    CreateSubscriptionRoutingModule,
    MaterialModule
  ]
})
export class CreateSubscriptionModule { }
