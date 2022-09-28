import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefundRoutingModule } from './refund-routing.module';
import { RefundComponent } from './refund.component';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [RefundComponent],
  imports: [CommonModule, RefundRoutingModule, AntModule],
})
export class RefundModule {}
