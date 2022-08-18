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
import { UtilsService } from 'src/app/services/utils.service';
import { OrderDetailsComponent } from '../order-details.component';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
})
export class CreateInvoiceComponent implements OnInit {
  public dataForm: FormGroup;

  private subRouteOne?: Subscription;
  invoiceProducts: any[] = [];
  public date = new Date();
  createInvoice = false;
  id: any;
  order: Order;
  DateToday: Date = new Date()
  canceledOrderSku: string;
  canceledOrderAmount: number;
  selectedIds: any[] = [];

  // invoice : any;

  constructor(
    public fb: FormBuilder,
    public orderService: OrderService,
    public invoiceService: InvoiceService,
    public uiService: UiService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<CreateInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.order = this.data.order;
    this.canceledOrderSku = this.data.canceledOrderSku;
    this.canceledOrderAmount = this.data.canceledOrderAmount;
    this.selectedIds = this.data.selectedIds;
    console.log(this.selectedIds);
    let products = this.order.orderedItems;
    for(let i=0; i<this.selectedIds.length; i++){
      this.invoiceProducts[i]=products[this.selectedIds[i]];
    }
    this.invoiceProducts.forEach(f => {
      f.originalQty = f.quantity;
    });

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
      orderNumber: [null, Validators.required],
      invoiceDate: [null, Validators.required],
      //salesPerson: [null, Validators.required],
      shippingCarrier: [null, Validators.required],
      //deliveryFee: [null, Validators.required],
      //adjustment: [null, Validators.required],
      deliveryStatus: [null],
      quantity: [null],
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

  calculateSubTotal() {
    let total = 0;
    for (let i = 0; i < this.invoiceProducts?.length; i++) {
      total +=
        (this.invoiceProducts[i].price + this.invoiceProducts[i].tax) *
        this.invoiceProducts[i].quantity;
    }
    return total;
  }
  paidAmmount() {
    let total = 0;
    for (let i = 0; i < this.order?.orderedItems.length; i++) {
      total +=this.order?.orderedItems[i]?.advance
    }
    return total;
  }

  /**
   * Invoice
   */
  onSubmitInvoice() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }


    let invoice = {
      orderNumber: this.dataForm.value.orderNumber,
      // invoiceDate: this.dataForm.value.invoiceDate,
      invoiceDate: new Date(),
      //salesPerson: this.dataForm.value.salesPerson ?this.dataForm.value.salesPerson: 'shamim'  ,
      customerName: this.order.name
        ? this.order.name
        : this.order.user.fullName,
      billingAddress: this.order.user?.addresses[0]
        ? this.order.user?.addresses[0]
        : 'Dhaka',
      shippingAddress: this.order.shippingAddress,
      shippingCarrier: this.dataForm.value.shippingCarrier,
      products: this.invoiceProducts,
      paidAmount: this.order.paidAmount,
      subTotal: this.calculateSubTotal(),
      deliveryFee: this.dataForm.value.deliveryFee,
      adjustment: this.dataForm.value.adjustment,
      total:
        this.calculateSubTotal() +
        this.dataForm.value.deliveryFee -
        this.dataForm.value.adjustment,
      deliveryStatus: ProductOrderStatus.INVOICED,
      paymentStatus: PaymentStatus.UNPAID,
    };

    console.log('onSubmitInvoice', invoice);
    this.invoiceService.placeInvoice(invoice).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.dialogRef.close();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  patchValues() {
    this.dataForm.patchValue({
      orderNumber: this.order?.orderId,
      invoiceDate: new Date().toLocaleDateString(),
    });
  }

  deleteFromInvoice(index: number) {
    this.invoiceProducts.splice(index, 1)
    // const index = value;
    // let newArray = array;
    // newArray.splice(index, 1);
    // // this.invoiceProducts.splice(index, 1);
    // this.invoiceProducts = newArray;
    // console.log('deleteFromInvoice', this.invoiceProducts);
  }

  quantity(i) {
    this.dataForm.get('quantity').valueChanges;
    this.invoiceProducts[i].quantity = this.dataForm.get('quantity').value;
  }

  // Decrement
  decrementQty(data: any, i: number) {
    console.log('Data decrementQty', data);
    if (data?.quantity === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    data.quantity -= 1;
  }

  // incrementQty
  incrementQuty(data: any, i: number) {

    console.log(data.quantity); // 13
    console.log(data.originalQty); // 15

    if(data.quantity === data.originalQty) {
      this.uiService.warn('Maximum Quantity is selected');
    } else {
      this.invoiceProducts[i].quantity += 1;
    }
  }
  close(){
    console.log("Closed");

    this.invoiceProducts = null;
  }
}
