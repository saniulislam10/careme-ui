import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssueRoutingModule } from './issue-routing.module';
import { IssueComponent } from './issue.component';


@NgModule({
  declarations: [
    IssueComponent
  ],
  imports: [
    CommonModule,
    IssueRoutingModule,
    MaterialModule
  ]
})
export class IssueModule { }
