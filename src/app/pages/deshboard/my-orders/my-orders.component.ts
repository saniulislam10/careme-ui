import { products } from 'src/app/core/utils/dashboard.data';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order, OrderItem } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';
import { OrderService } from 'src/app/services/order.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

interface ParentItemData {
  id: any;
  key: number;
  orderId: string;
  date: Date;
  expand?: boolean;
  products?: OrderItem[];
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
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

  tabs = ['All', 'To Pay', 'To Ship', 'To Receive'];
  listOfParentData: ParentItemData[] = [];
  // listOfChildrenData: ChildrenItemData[] = [];

  user: User;
  id: string;
  orders: Order[];
  userStatus: boolean;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private message: NzMessageService,
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getAllOrders();

  }
  setItems() {
    for (let i = 0; i < this.orders?.length; i++) {
      this.listOfParentData.push({
        key: i,
        id: this.orders[i]._id,
        orderId: this.orders[i].orderId,
        date: this.orders[i].checkoutDate,
        products: this.orders[i].orderedItems,
        expand: i === 0 ? true : false,
      });
    }
    console.log(this.listOfParentData);
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
