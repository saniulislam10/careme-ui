import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss'],
})
export class MethodsComponent implements OnInit {
  tabs = ['All Invoice', 'Closed', 'Pending'];
  isMethodVisible = false;
  openingTime = '1';
  instockValue = 'A';
  preOrderValue = 'A';
  typeChecked = [];
  deliveryTime = 'A';

  //  Day Schedule
  disabledSchedule = true;

  // time picker
  startTime: Date;
  endTime: Date;
  defaultOpenValue = new Date();

  shipedTable = [
    {
      name: 'General Method',
    },
    {
      name: 'Sameday Method',
    },
    {
      name: 'Nextday Method',
    },
    {
      name: 'Own Pick Method',
    },
  ];

  dayName = [
    {
      day: 'Monday',
    },
    {
      day: 'Tuesday',
    },
    {
      day: 'Wednesday',
    },
    {
      day: 'Thursday',
    },
    {
      day: 'Friday',
    },
    {
      day: 'Saturday',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.typeChecked.push('A');
  }

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

  proType(value: string[]): void {
    this.typeChecked = value;
  }
  tChecked(value: string) {
    const checkFound = this.typeChecked.find((e) => e === value);
    return checkFound;
  }
}
