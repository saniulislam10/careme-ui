import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReturnService } from 'src/app/services/return.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-create-invoice-return',
  templateUrl: './create-invoice-return.component.html',
  styleUrls: ['./create-invoice-return.component.scss']
})
export class CreateInvoiceReturnComponent implements OnInit {

  public dataForm: FormGroup;
  order: any;
  returnProducts: any[] = [];
  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public uiService: UiService,
    public returnService: ReturnService,
  ) { }

  ngOnInit(): void {
    this.order = this.data.order;
    let products = this.order.orderedItems;
    this.returnProducts = products;
    this.initFormGroup()
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      rma: [null],
      reason: [null],
      date: [null, Validators.required],
      deliveryFee: [null, Validators.required],
      adjustment: [null, Validators.required],
      quantity: [null],
    });
  }

  deleteFromReturn(array, value) {
    const index = value;
    let newArray = array;
    newArray.splice(index, 1);
    this.returnProducts = newArray;
  }

  calculateSubTotal() {
    let total = 0;
    for (let i = 0; i < this.returnProducts.length; i++) {
      total += (this.returnProducts[i].price + this.returnProducts[i].tax) * this.returnProducts[i].quantity;
    }
    return total;
  }

  quantity(i){
    this.dataForm.get('quantity').valueChanges
    this.returnProducts[i].quantity = this.dataForm.get('quantity').value;
  }

  /**
   * On Submit
   */
   onSubmitReturn() {

    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    let returnObj = {
      orderNumber: this.order.orderId,
      returnDate: this.dataForm.value.date,
      customerName: this.order.name ? this.order.name : this.order.user.fullName,
      billingAddress: this.order.user.addresses[0],
      shippingAddress: this.order.shippingAddress,
      products: this.returnProducts,
      subTotal: this.calculateSubTotal(),
      deliveryFee: this.dataForm.value.deliveryFee,
      adjustment: this.dataForm.value.adjustment,
      total: this.calculateSubTotal() + this.dataForm.value.deliveryFee - this.dataForm.value.adjustment,
    };
    this.returnService.placeReturn(returnObj).subscribe((res) => {
      this.uiService.success(res.message);
    }, (err) => {
      console.log(err);
    })

  }


}
