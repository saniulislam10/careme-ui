import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnInit {
  checkedAll = false;
  tabs = ['All Invoice', 'Closed', 'Pending'];
  shipedTable = [
    {
      name: 'Standard Shipping',
    },
    {
      name: 'Express Shipping',
    },
    {
      name: 'Pick by own',
    },
  ];
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
  zoneVisible = false;
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
