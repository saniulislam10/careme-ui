import { SubscriptionUiPopupComponent } from './subscription-ui-popup/subscription-ui-popup.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-subscription-ui-front',
  templateUrl: './subscription-ui-front.component.html',
  styleUrls: ['./subscription-ui-front.component.scss']
})
export class SubscriptionUiFrontComponent implements OnInit {
  @ViewChild("popUp") subscriptionPopUp:SubscriptionUiPopupComponent;
  title = 'Shamin Hossain';
  constructor() { }

  ngOnInit(): void {
  }

  showPop(){
    this.subscriptionPopUp.popUp = true;
  }

}
