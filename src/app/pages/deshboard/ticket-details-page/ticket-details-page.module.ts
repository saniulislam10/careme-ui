import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketDetailsPageRoutingModule } from './ticket-details-page-routing.module';
import { TicketDetailsPageComponent } from './ticket-details-page.component';


@NgModule({
  declarations: [
    TicketDetailsPageComponent
  ],
  imports: [
    CommonModule,
    TicketDetailsPageRoutingModule,
    MaterialModule
  ]
})
export class TicketDetailsPageModule { }
