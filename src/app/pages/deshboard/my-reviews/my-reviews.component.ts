import { UserDataService } from './../../../services/user-data.service';
import { Review } from './../../../interfaces/review';
import { ReviewService } from './../../../services/review.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss']
})
export class MyReviewsComponent implements OnInit {

  tabs = ['All', 'To Reviews'];
  listOfParentData: Review[] = [];
  value = 3;
  id: string;

  constructor(
    private reviewService: ReviewService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit(): void {
    this.getUserReviews();
  }
  getUserReviews() {
    this.reviewService.getAllByUser()
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
