import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderStatus } from 'src/app/enum/order-status';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  list = [
    'Shipped',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
  ];

  listOfChildrenData: any[] = [];
  order: Order;
  id: any;
  subRouteOne: any;
  index: string;
  thumbnailImage: any;
  success: boolean = true;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private msg : NzMessageService
  ) {}

  isVisible = false;
  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }
  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getOrderById(this.id);
      }
    });
  }

  getOrderById(id) {
    console.log(id);
    this.orderService.getOrderDetails(id).subscribe(
      (res) => {
        this.order = res.data;
        this.listOfChildrenData = this.order.orderedItems;
        console.log(this.listOfChildrenData);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getThumbnailImage(data?) {
    if(data){
      let images = this.productService.getImages(data?.medias, data?.images);
      return images[0];
    }
    return '/assets/images/placeholder/test.png';
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

  getSubTotal(){
    let total = 0;
     this.listOfChildrenData.forEach(m => {
      total += (m.price+m.tax) * m.quantity
    })
    return total;
  }

  onCancel(data, i){
    this.order.orderedItems[i].deliveryStatus = OrderStatus.CANCEL;
    this.decreaseCommitted(data, data.productId._id);
    this.increaseAvailable(data, data.productId._id);
    if (this.success) {
      this.updateOrder(this.order);
    }else{
      this.msg.error('Order Could not be Canceled');
    }
  }

  updateOrder(order) {
    this.orderService.updateOrderById(order).subscribe(
      (res) => {
        this.msg.success(res.message);
      },
      (err) => {
        this.msg.error(err.message);
        return;
      }
    );
  }

  decreaseCommitted(data, id) {
    this.productService.decreaseCommitedProductQuantity(data, id).subscribe(
      (res) => {
        // this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        // this.msg.error(err.message);
        this.success = false;
      }
    );
  }

  increaseAvailable(data, id) {
    this.productService.increaseAvailableProductQuantity(data, id).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.success = true;
      },
      (err) => {
        this.msg.error(err.message);
        this.success = false;
      }
    );
  }



}
