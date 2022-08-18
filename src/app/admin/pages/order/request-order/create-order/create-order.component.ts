import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

  createOrder = false;

  constructor() { }

  ngOnInit(): void {
  }

    /**** create Order Toggle */
    createOrderShow(){
      this.createOrder = true;
    }
    createOrderHide(){
      this.createOrder = false;
    }
  

}
