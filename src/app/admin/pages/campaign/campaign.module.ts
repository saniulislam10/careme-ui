import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign.component';
import { CreateCampaignComponent } from './create-campaign/create-campaign.component';


@NgModule({
  declarations: [
    CampaignComponent,
    CreateCampaignComponent
  ],
  imports: [
    CommonModule,
    CampaignRoutingModule,
    MaterialModule
  ]
})
export class CampaignModule { }
