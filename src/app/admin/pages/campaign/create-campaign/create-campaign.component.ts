import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss']
})
export class CreateCampaignComponent implements OnInit {

  campaignPopUp =false;
  constructor() { }

  ngOnInit(): void {
  }
  popUpHide(){
    this.campaignPopUp = false;
  }

}
