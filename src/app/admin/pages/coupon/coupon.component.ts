import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
})
export class CouponComponent implements OnInit {
  searchProduct = false;

  constructor() {}

  ngOnInit(): void {}

  searchProductActive() {
    this.searchProduct = true;
  }

  searchProductInactive() {
    this.searchProduct = false;
  }
}
