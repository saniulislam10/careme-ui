import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { OrderService } from 'src/app/services/order.service';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {

  amount: number=0;
  orderId: string;
  paymentStatus: string;
  private subRouteOne?: Subscription;


  constructor(
    private userService: UserService,
    private userDataService: UserDataService,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private sessionStorage: StorageService,
    private router: Router,

  ) { }

  ngOnInit(): void {

    this.subRouteOne = this.activatedRoute.queryParamMap.subscribe((param) => {
      this.orderId = param.get('orderId');
      

      

      if (this.orderId) {
        this.amount = this.sessionStorage.getDataFromSessionStorage('amount');
        this.paymentStatus = this.sessionStorage.getDataFromSessionStorage('paymentStatus');
        console.log("this is payemnet",this.paymentStatus)
        
      } else {
        console.log('Error');
      }
    });



  }

  payPayment(){

      this.orderService.updateOrder({orderId:this.orderId,paidAmount:this.amount,paymentStatus:this.paymentStatus}).subscribe((res)=>{
        if(res.success){
          this.uiService.success("Your Payment is successful")
          this.router.navigate([''],);
        }else{
          this.uiService.warn("Something went wrong")
        }
      })
    }

}
