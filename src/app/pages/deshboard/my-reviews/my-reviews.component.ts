import { Review } from './../../../interfaces/review';
import { ReviewService } from './../../../services/review.service';
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
  listOfParentData: Review[] = [];
  value = 3;

  constructor(
    private reviewService: ReviewService
  ) { }

  ngOnInit(): void {
    this.reviewService.getAll()
    .subscribe( res => {
      this.listOfParentData = res.data;
    }, err => {
      console.log(err);

    })
  }

  onTabSelect(tab){
    console.log(tab)
  }

}
