import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit {

  createVendor = false;

  constructor(
  ) { }

  ngOnInit(): void {
  }
  /***
   * Control Create Vendor
   */
  hideCreateVendor(){
    this.createVendor = false;
  }
  showCreateVendor(){
    this.createVendor = true;
  }

}
