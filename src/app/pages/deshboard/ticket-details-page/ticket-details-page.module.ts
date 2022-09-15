import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';

import { TicketDetailsPageRoutingModule } from './ticket-details-page-routing.module';
import { TicketDetailsPageComponent } from './ticket-details-page.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@NgModule({
  declarations: [TicketDetailsPageComponent],
  imports: [
    CommonModule,
    TicketDetailsPageRoutingModule,
    MaterialModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzImageModule,
    NzInputModule,
    NzIconModule,
  ],
})
export class TicketDetailsPageModule {}
