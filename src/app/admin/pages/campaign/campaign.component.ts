import { CreateCampaignComponent } from './create-campaign/create-campaign.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {
  @ViewChild('createCampaign') createCampaign:CreateCampaignComponent;

  constructor() { }

  ngOnInit(): void {
  }

  showCampaign(){
    this.createCampaign.campaignPopUp = true;
  }

}
