import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';

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
  order: any;
  id: any;
  subRouteOne: any;
  index: string;
  thumbnailImage: any;

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
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

  getThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
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

  getSubTotal(){
    let total = 0;
     this.listOfChildrenData.forEach(m => {
      total += (m.price+m.tax) * m.quantity
    })
    return total;
  }

}
