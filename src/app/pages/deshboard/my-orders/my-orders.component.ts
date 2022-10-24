import { ProductService } from 'src/app/services/product.service';
import { products } from 'src/app/core/utils/dashboard.data';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/order.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

interface ParentItemData {
  id: any;
  key: number;
  orderId: string;
  date: Date;
  expand?: boolean;
  paidAmount: number;
  totalAmount: number;
  products?: OrderItem[];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  currentDate = Date.now();
  timeLeft: number = 60;
  interval;

  tabs = ['All', 'To Pay', 'To Ship', 'To Receive'];
  listOfParentData: ParentItemData[] = [];

  user: User;
  id: string;
  orders: Order[];
  userStatus: boolean;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private message: NzMessageService,
    private userDataService: UserDataService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllOrders();

  }

  startTimer(date) {
    var checkOutDate = new Date(date);
    var seconds = checkOutDate.getTime(); //1440516958
    let deadline = seconds + 1000 * 60 * 60 * 3 * 1 ;
    return deadline;
  }

  displayPayNow(date){
    let deadline = this.startTimer(date);
    let diff = deadline - Date.now();
    return diff;
  }

  setItems() {
    for (let i = 0; i < this.orders?.length; i++) {
      this.listOfParentData.push({
        key: i,
        id: this.orders[i]._id,
        orderId: this.orders[i].orderId,
        date: this.orders[i].checkoutDate,
        products: this.orders[i].orderedItems,
        paidAmount: this.orders[i].paidAmount,
        totalAmount: this.orders[i].totalAmount,
        expand: i === 0 ? true : false,
      });
    }
    console.log(this.listOfParentData);
  }

  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  getUser() {
    this.userStatus = this.userService.getUserStatus();
    if (this.userStatus) {
      this.getLoggedInUserInfo();
    } else {
      let type = 'error';
      this.message.create(type, `Please Login First`);
    }
  }

  getLoggedInUserInfo() {
    if (this.userStatus) {
      this.userDataService.getLoggedInUserInfo().subscribe(
        (res) => {
          this.user = res.data;
          this.id = this.user._id;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  getAllOrders() {
    this.orderService.getAllOrdersByUser(null, null, this.id).subscribe(
      (res) => {
        this.orders = res.data;
        this.setItems();
        this.startTimer(this.orders[0].checkoutDate)
        console.log(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onTabSelect(tab) {
    console.log(tab);
  }
}
