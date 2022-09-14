import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsPageRoutingModule } from './tickets-page-routing.module';
import { TicketsPageComponent } from './tickets-page.component';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [TicketsPageComponent, CreateTicketsComponent],
  imports: [
    CommonModule,
    TicketsPageRoutingModule,
    MaterialModule,
    NzTableModule,
    NzCardModule,
    NzTabsModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule,
  ],
})
export class TicketsPageModule {}
