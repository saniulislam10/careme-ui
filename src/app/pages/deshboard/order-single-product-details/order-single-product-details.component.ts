import { Component, OnInit } from '@angular/core';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';


interface ChildrenItemData {
  name: string;
  sku: string;
  variantName: string;
  qty: number;
  total: number;
  advance: number;
  advanceType: number;
  advanceInTaka: number;
  paymentStatus: string;
  orderStatus: string;
  deliveryDate: Date;
}


@Component({
  selector: 'app-order-single-product-details',
  templateUrl: './order-single-product-details.component.html',
  styleUrls: ['./order-single-product-details.component.scss']
})
export class OrderSingleProductDetailsComponent implements OnInit {

  listOfChildrenData: ChildrenItemData[] = [];
  currentDate : Date = new Date();
  constructor() { }
  mode : NzTimelineMode = 'left';

  ngOnInit(): void {
    this.listOfChildrenData.push({
      name: "Nike Hypervenom viper ultra rare edition 20.3",
      sku: "viper001",
      variantName: "L/XL",
      qty: 2,
      total: 123,
      advance: 15,
      advanceType: 1,
      advanceInTaka: 123,
      paymentStatus: 'Payment Status',
      orderStatus: 'Pending',
      deliveryDate: new Date()
    });
  }

}
