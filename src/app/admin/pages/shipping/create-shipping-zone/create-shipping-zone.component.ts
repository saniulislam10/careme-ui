import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss'],
})
export class CreateShippingZoneComponent implements OnInit {
  // For Details
  zoneVisible = false;
  chooseProduct = 'all';

  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  constructor() {}

  ngOnInit(): void {
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }

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
