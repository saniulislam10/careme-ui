import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss'],
})
export class CustomerProfileComponent implements OnInit {
  customerActive = true;
  smsVisible = false;
  createOrder = false;

  constructor() {}
  ngOnInit(): void {}

  // Message send
  showSmsModal(): void {
    this.smsVisible = true;
  }
  smsOk(): void {
    console.log('Button ok clicked!');
    this.smsVisible = false;
  }
  smsCancel(): void {
    console.log('Button cancel clicked!');
    this.smsVisible = false;
  }

  // New Order Create
  orderModal(): void {
    this.createOrder = true;
  }
  orderOk(): void {
    console.log('Button ok clicked!');
    this.createOrder = false;
  }
  orderCancel(): void {
    console.log('Button cancel clicked!');
    this.createOrder = false;
  }
}
