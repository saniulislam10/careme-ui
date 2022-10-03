import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Order } from 'src/app/interfaces/order';
import { User } from 'src/app/interfaces/user';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  public output: string;


  // TODO something this.action

  listOfData: ItemData[] = [];
  user: User;
  id: string;
  orders: Order[];
  userStatus: boolean;

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private message: NzMessageService,
    private userDataService: UserDataService,
  ) { }

  ngOnInit(): void {

    this.userStatus = this.userService.getUserStatus();
    if(this.userStatus){
      this.getLoggedInUserInfo();
    }else{
      let type = 'error';
      this.message.create(type, `Please Login First`);
    }
  }
  getUser() {

  }

  getLoggedInUserInfo() {
    if(this.userStatus){
      this.userDataService.getLoggedInUserInfo()
        .subscribe(res => {
          this.user = res.data;
          this.id = this.user._id;
          this.getAllOrders(this.id);
        }, error => {
          console.log(error);
        });
    }
  }

  getAllOrders(id) {
    console.log(id);
    this.orderService.getAllOrdersByUser(null, null, id)
    .subscribe(res => {
      this.orders = res.data;
      console.log(res.data);
    }, err => {
      console.log(err);
    })
  }

  public onError(e: any): void {
    alert(e);
  }



}
