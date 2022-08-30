import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-cart-popup',
  templateUrl: './add-to-cart-popup.component.html',
  styleUrls: ['./add-to-cart-popup.component.scss']
})
export class AddToCartPopupComponent implements OnInit {

  // addToCartPop = false;
  image: any;

  constructor(
    public dialogRef: MatDialogRef<AddToCartPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  getRoundValue(price, quantity){
    return Math.floor(price*quantity);
  }
  /***
   * Controll Add To Cart Pop
   */

  // showPopUp(){
  //   this.addToCartPop = true;
  // }
  // hidePopUp(){
  //   this.addToCartPop = false;
  // }

}
