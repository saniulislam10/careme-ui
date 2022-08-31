import { Component, OnInit } from '@angular/core';

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
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  list = [
    'Shipped',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.'
  ];

  listOfChildrenData: ChildrenItemData[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 1; ++i) {
      for (let j = 0; j < 3; ++j) {
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
  }

}
