import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { Subscription } from 'rxjs';


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
  index: string;
  data: any;
  mode : NzTimelineMode = 'left';
  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
  ) { }


  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      this.index = param.get('index');
      console.log(this.id);
      console.log(this.index);
      if (this.id) {
        this.getOrderById(this.id, this.index);
      }
    });
  }

  getOrderById(id, index){
    this.orderService.getOrderDetails(id)
    .subscribe( res => {
      this.order = res.data;
      console.log(this.order);
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

}
