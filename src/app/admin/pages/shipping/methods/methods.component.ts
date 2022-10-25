import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss'],
})
export class MethodsComponent implements OnInit {
  tabs = ['All Invoice', 'Closed', 'Pending'];
  isMethodVisible = false;
  instockValue = 'A';
  preOrderValue = 'A';

  // time picker
  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

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

  showMathod(): void {
    this.isMethodVisible = true;
  }
  mathodOk(): void {
    console.log('Button ok clicked!');
    this.isMethodVisible = false;
  }
  mathodCancel(): void {
    console.log('Button cancel clicked!');
    this.isMethodVisible = false;
  }
}
