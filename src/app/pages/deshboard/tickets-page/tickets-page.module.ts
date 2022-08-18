import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsPageRoutingModule } from './tickets-page-routing.module';
import { TicketsPageComponent } from './tickets-page.component';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';


@NgModule({
  declarations: [
    TicketsPageComponent,
    CreateTicketsComponent
  ],
  imports: [
    CommonModule,
    TicketsPageRoutingModule,
    MaterialModule
  ]
})
export class TicketsPageModule { }
