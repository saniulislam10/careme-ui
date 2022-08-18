import { CreateShippingZoneComponent } from './create-shipping-zone/create-shipping-zone.component';
import { AddCourierComponent } from './add-courier/add-courier.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss']
})
export class ShippingComponent implements OnInit {

  @ViewChild('addCourier') addCurier:AddCourierComponent;
  
  @ViewChild('createZone') createZone:CreateShippingZoneComponent;

  constructor() { }

  ngOnInit(): void {
  }

  showCurier(){
    this.addCurier.curierPopUp = true;
  }

  showZone(){
    this.createZone.createZonePopUp = true;
  }

}
