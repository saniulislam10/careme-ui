import { ShippingProfile } from './../../../interfaces/shipping-profile';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShippingService } from './../../../services/shipping.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnInit {
  checkedAll = false;
  tabs = ['All Invoice', 'Closed', 'Pending'];
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  profiles: ShippingProfile[] = [];
  constructor(
    private shippingService : ShippingService,
    private msg : NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllProfile();
  }
  getAllProfile(){
    this.shippingService.getAllProfile()
    .subscribe(res => {
      console.log(res.data);
      this.profiles = res.data;
    }, err=> {
      this.msg.error(err.message);
    })
  }
}
