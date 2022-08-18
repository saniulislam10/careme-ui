import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnPolicyRoutingModule } from './return-policy-routing.module';
import { ReturnPolicyComponent } from './return-policy.component';


@NgModule({
  declarations: [
    ReturnPolicyComponent
  ],
  imports: [
    CommonModule,
    ReturnPolicyRoutingModule
  ]
})
export class ReturnPolicyModule { }
