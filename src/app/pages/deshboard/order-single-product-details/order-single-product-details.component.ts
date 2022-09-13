import { NzMessageService } from 'ng-zorro-antd/message';
import { UserDataService } from 'src/app/services/user-data.service';
import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';


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

  listOfChildrenData: any[] = [];
  currentDate : Date = new Date();
  subRouteOne: Subscription;
  id: string;
  order: Order;
  index: number;
  data: any;
  mode : NzTimelineMode = 'left';
  isVisibleTop: boolean = false;
  reviewMessage : string;
  reviewForm : FormGroup;
  userId : any;
  productId : any;
  orderNo: any;
  sku: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private userDataService: UserDataService,
    private reviewService: ReviewService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      this.index = Number(param.get('index'));
      if (this.index >=0 ) {
        this.getOrderById(this.id, this.index);
      }
    });

    this.initReviewForm();
    this.getUserInfo();

  }

  getUserInfo(){
    this.userDataService.getLoggedInUserInfo()
    .subscribe(res =>{
      this.userId = res.data._id;
    }, err => {
      this.message.create('error', err);
    })
  }

  initReviewForm(){
    this.reviewForm = this.fb.group({
      reviewMessage : [null, Validators.required]
    })
  }

  getOrderById(id, index){
    this.orderService.getOrderDetails(id)
    .subscribe( res => {
      this.order = res.data;
      this.listOfChildrenData.push(this.order.orderedItems[index]);
      console.log(this.listOfChildrenData);
    }, err => {
      console.log(err);
    })
  }

  setThumbnailImage(data) {
    let images = this.getImages(data?.medias, data?.images);
    return images[0];
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias && medias.length > 0) {
      for (let i = 0, x = 0; i < medias.length; i++) {
        if (medias[i] !== null && medias[i] !== '') {
          allMedias.push(medias[i]);
          x++;
        }
      }
      allMedias = [...allMedias, ...images];
    } else {
      allMedias = images;
    }
    return allMedias;
  }

  handleOk() {
    if(this.reviewForm.invalid){
      this.message.create('warning', "Provide your review before submitting");
      return
    }

    let data = {
      user: this.userId,
      product: this.productId,
      rating : 5,
      sku : this.sku,
      orderNo : this.orderNo,
      date : new Date(),
      message : this.reviewForm.value.reviewMessage
    }
    this.reviewService.add(data)
    .subscribe(res => {
      this.message.create('success', res.message);
    }, err=>{
      this.message.create('error', err);
    })
    this.productId = null;
    this.orderNo = null;
    this.sku = null;
    this.isVisibleTop = false;
  }

  handleCancel(): void {
    this.productId = null;
    this.orderNo = null;
    this.sku = null;
    this.isVisibleTop = false;

  }

  openReview(sku, id, orderNo){
    this.productId = id;
    this.orderNo = orderNo;
    this.sku = sku;
    this.isVisibleTop = true;
  }

}
