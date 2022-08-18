import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { Order } from 'src/app/interfaces/order';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {

  public dataForm: FormGroup;

  private subRouteOne?: Subscription;
  public invoiceProducts: any[] = [];
  public date = new Date();
  createInvoice = false;
  id: any;
  order: Order;
  // invoice : any;


  constructor(
    public fb : FormBuilder,
    public orderService: OrderService,
    public invoiceService: InvoiceService,
    public uiService: UiService,
    private activatedRoute: ActivatedRoute,
    public dialogRef: MatDialogRef<CreateInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.order = this.data.order;
    let products = this.order.orderedItems;
    this.invoiceProducts = products;
    products = [];

    // INIT FORM
    this.initFormGroup();
    this.patchValues();
  }

  /**
   * INIT FORM
   */
   private initFormGroup() {
     this.dataForm = this.fb.group({
    orderNumber:[null, Validators.required],
    invoiceDate:[null, Validators.required],
    salesPerson:[null, Validators.required],
    shippingCarrier:[null, Validators.required],
    deliveryFee:[null, Validators.required],
    adjustment:[null, Validators.required],
    deliveryStatus:[null],
    quantity:[null],



  });
  }


  /**
   * Calculation
   */

   calculateTotalTax() {
    let tax = 0;
    for (let i = 0; i < this.order?.orderedItems.length; i++) {
      tax += this.calculateTax(
        this.order.orderedItems[i].tax,
        this.order.orderedItems[i].quantity
      );
    }
    return tax;
  }

  calculateTax(tax, quantity): number {
    return tax * quantity;
  }

  calculateSubTotal(){
    let total = 0;
    for(let i=0; i<this.invoiceProducts.length;i++){
      total += (this.invoiceProducts[i].price + this.invoiceProducts[i].tax)*this.invoiceProducts[i].quantity;
    }
    return total;
  }

  /**
   * Invoice
   */
   onSubmitInvoice(){

    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }



     let invoice={
      orderNumber:this.dataForm.value.orderNumber,
      invoiceDate:this.dataForm.value.invoiceDate,
      salesPerson:this.dataForm.value.salesPerson,
      customerName: this.order.name ? this.order.name : this.order.user.fullName,
      billingAddress: this.order.user.addresses[0],
      shippingAddress: this.order.shippingAddress,
      shippingCarrier:this.dataForm.value.shippingCarrier,
      products: this.invoiceProducts,
      subTotal: this.calculateSubTotal(),
      deliveryFee: this.dataForm.value.deliveryFee,
      adjustment: this.dataForm.value.adjustment,
      total: this.calculateSubTotal() + this.dataForm.value.deliveryFee - this.dataForm.value.adjustment,
      deliveryStatus: ProductOrderStatus.INVOICED,
      paymentStatus: PaymentStatus.UNPAID,
     };
     this.invoiceService.placeInvoice(invoice).subscribe((res) => {
      this.uiService.success(res.message);
     },(err) =>{
       console.log(err);
     })

   }

   patchValues(){
    this.dataForm.patchValue({
      orderNumber: this.order?.orderId,
      invoiceDate: new Date().toLocaleDateString(),
    });
  }

  deleteFromInvoice(array, value){
    const index = value;
    let newArray = array;
    newArray.splice(index, 1);
    this.invoiceProducts = newArray;
  }

  quantity(i){
    this.dataForm.get('quantity').valueChanges
    this.invoiceProducts[i].quantity = this.dataForm.get('quantity').value;
  }

}
