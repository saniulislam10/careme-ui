import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubscriptionDetailsRoutingModule } from './subscription-details-routing.module';
import { SubscriptionDetailsComponent } from './subscription-details.component';
import { EditComponent } from './edit/edit.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    SubscriptionDetailsComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    SubscriptionDetailsRoutingModule,
    MaterialModule
  ]
})
export class SubscriptionDetailsModule { }
