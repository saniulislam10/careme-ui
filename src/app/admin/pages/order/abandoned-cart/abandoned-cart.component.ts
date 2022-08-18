import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-abandoned-cart',
  templateUrl: './abandoned-cart.component.html',
  styleUrls: ['./abandoned-cart.component.scss']
})
export class AbandonedCartComponent implements OnInit {

  abandonedData: any[] = [];
  constructor(
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.getAllAbandonedCart();
  }

  getAllAbandonedCart(){
    this.cartService.getAllAbandonedCart()
    .subscribe(res =>{
      this.abandonedData = res.data;
    },err => {
      console.log(err);

    })
  }

}
