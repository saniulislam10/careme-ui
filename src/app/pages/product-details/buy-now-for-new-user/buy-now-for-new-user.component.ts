import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-buy-now-for-new-user',
  templateUrl: './buy-now-for-new-user.component.html',
  styleUrls: ['./buy-now-for-new-user.component.scss']
})
export class BuyNowForNewUserComponent implements OnInit {

  newUser = false;
  buyNow = false;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: Product,
    // public dialogRef: MatDialogRef<BuyNowForNewUserComponent>,
  ) { }

  ngOnInit(): void {

  }

  /****
   * New User Popup show
   */
  newUserPopUpShow(){
    this.newUser = true;
  }
/***
 * New user pop up hide
*/
newUserPopUpHide(){
  this.newUser = false;
}

}
