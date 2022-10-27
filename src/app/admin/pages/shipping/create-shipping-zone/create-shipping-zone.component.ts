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
  shippingMethod = [
    {
      name: 'General Method',
      value: 1,
    },
    {
      name: 'Sameday Method',
      value: 2,
    },
    {
      name: 'Nextday Method',
      value: 3,
    },
    {
      name: 'Own Pick Method',
      value: 4,
    },
  ];
  dataSet = [
    {
      name: 'General Method',
      rate: '120',
      enable: 'true',
    },
    {
      name: 'Sameday Method',
      rate: '200',
      enable: 'false',
    },
    {
      name: 'Nextday Method',
      rate: '150',
      enable: 'false',
    },
    {
      name: 'Own Pick Method',
      rate: '15',
      enable: 'false',
    },
  ];

  // Choose Category
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  constructor() {}

  ngOnInit(): void {
    // Choose Category
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 0; i < 100; i++) {
      children.push({ label: 'Category' + i, value: 'value' + i });
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
