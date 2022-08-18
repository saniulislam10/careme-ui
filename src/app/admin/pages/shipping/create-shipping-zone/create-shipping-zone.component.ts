import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss']
})
export class CreateShippingZoneComponent implements OnInit {

  createZonePopUp = false;
  constructor() { }

  ngOnInit(): void {
  }
  ZonepopUpHide(){
    this.  createZonePopUp  = false;
  }
  

}
