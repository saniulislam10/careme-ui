import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefundRoutingModule } from './refund-routing.module';
import { RefundComponent } from './refund.component';
import { AntModule } from 'src/app/material/ant.module';
import { DetailsComponent } from './details/details.component';

@NgModule({
  declarations: [RefundComponent, DetailsComponent],
  imports: [CommonModule, RefundRoutingModule, AntModule],
})
export class RefundModule {}
