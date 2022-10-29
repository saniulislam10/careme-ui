import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-coupon',
  templateUrl: './create-coupon.component.html',
  styleUrls: ['./create-coupon.component.scss'],
})
export class CreateCouponComponent implements OnInit {
  mathodValue = 'A';
  minRequie = 'A';
  custoemrRequie = 'A';
  couponValue = 'percentage';
  useLimit = false;

  dateFormat = 'yyyy/MM/dd';
  monthFormat = 'yyyy/MM';

  time: Date | null = null;
  defaultOpenValue = new Date(0, 0, 0, 0, 0, 0);

  enddateChecked = false;

  constructor() {}

  ngOnInit(): void {}
}
