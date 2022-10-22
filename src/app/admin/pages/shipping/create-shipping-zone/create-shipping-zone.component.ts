import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss'],
})
export class CreateShippingZoneComponent implements OnInit {
  // For Details
  zoneVisible = false;

  constructor() {}

  ngOnInit(): void {}

  // For Details
  showZoneModal(): void {
    this.zoneVisible = true;
  }
  zoneOk(): void {
    console.log('Button ok clicked!');
    this.zoneVisible = false;
  }
  zoneCancel(): void {
    console.log('Button cancel clicked!');
    this.zoneVisible = false;
  }
}
