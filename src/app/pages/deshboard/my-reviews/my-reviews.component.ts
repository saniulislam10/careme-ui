import { Component, OnInit } from '@angular/core';

interface ParentItemData {
  key: number;
  orderId: string;
  date: Date;
  expand?: boolean;
}

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
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent implements OnInit {

  tabs = ['All', 'To Reviews'];
  listOfParentData: ParentItemData[] = [];
  listOfChildrenData: ChildrenItemData[] = [];

  constructor() { }

  ngOnInit(): void {
    for (let i = 0; i < 3; ++i) {
      this.listOfParentData.push({
        key: i,
        orderId: '12314' + Number(i),
        date: new Date(),
        expand: i === 0 ? true : false
      });
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

  onTabSelect(tab){
    console.log(tab)
  }

}
