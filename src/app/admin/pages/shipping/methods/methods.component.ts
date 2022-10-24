import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss'],
})
export class MethodsComponent implements OnInit {
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
    {
      name: 'Next day',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
