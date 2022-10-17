import { Invoice } from 'src/app/interfaces/invoice';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { Order, OrderItem } from 'src/app/interfaces/order';
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
  invoiceProducts: OrderItem[] = [];
  public date = new Date();
  createInvoice = false;
  id: any;
  order: Order;
  DateToday: Date = new Date()
  canceledOrderSku: string;
  canceledOrderAmount: number;
  redeemedPoints = 0;
  couponAmount = 0;
  adjustmentAmount = 0;
  shippingCharge = 0;
  selectedIds: any[] = [];

  // invoice : any;

  constructor(
    public fb: FormBuilder,
    public orderService: OrderService,
    public invoiceService: InvoiceService,
    public uiService: UiService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private msg: NzMessageService,
    public dialogRef: MatDialogRef<CreateInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.order = this.data.order;
    this.redeemedPoints = this.order.redeemedPoints ? this.order.redeemedPoints : 0;
    this.couponAmount = this.order.couponAmount ? this.order.couponAmount : 0;
    this.adjustmentAmount = this.order.adjustmentAmount ? this.order.adjustmentAmount : 0;
    this.shippingCharge = this.order.shippingCharge ? this.order.shippingCharge : 0;
    this.canceledOrderSku = this.data.canceledOrderSku;
    this.canceledOrderAmount = this.data.canceledOrderAmount;
    this.selectedIds = this.data.selectedIds;
    let products = this.order.orderedItems;
    for(let i=0; i<this.selectedIds.length; i++){
      this.invoiceProducts[i]=products[this.selectedIds[i]];
    }
    this.invoiceProducts.forEach(f => {
      let qty = f.quantity-f.invoicedQuantity;
      f.totalOrderQty = f.quantity;
      f.quantity = qty;
      f.maxQty = qty;
      f.returnedQuantity = 0;
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

  calculateSubTotal():number {
    let total: number = 0;
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
      total +=this.order?.orderedItems[i]?.advanceAmount
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

    let invoice: Invoice = {
      orderNumber: this.dataForm.value.orderNumber,
      invoiceDate: new Date(),
      customerName: this.order.name,
      shippingAddress: this.order.shippingAddress,
      shippingCarrier: this.dataForm.value.shippingCarrier,
      products: this.invoiceProducts,
      subTotal: this.calculateSubTotal(),
      deliveryFee: this.dataForm.value.deliveryFee,
      adjustment: this.dataForm.value.adjustment,
      total: this.calculateSubTotal() +
        this.dataForm.value.deliveryFee,
      deliveryStatus: ProductOrderStatus.SHIPPING,
      paymentStatus: PaymentStatus.UNPAID,
      // phoneNo: '',
      // email: '',
      // billingAddress: undefined,
      shippingStatus: 0,
      paidAmount: 0
    };

    this.invoiceService.placeInvoice(invoice).subscribe(
      (res) => {
        this.msg.success(res.message);
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
    this.invoiceProducts.splice(index, 1);
  }

  quantity(i) {
    this.dataForm.get('quantity').valueChanges;
    this.invoiceProducts[i].quantity = this.dataForm.get('quantity').value;
  }


  changeAdjust(value){
    this.adjustmentAmount = Number(value);
  }
  changeShippingCharge(value){
    this.shippingCharge = Number(value);
  }

  // Decrement
  decrementQty(data: any, i: number) {
    if (data?.quantity <= 1) {
      this.msg.create('warning','Minimum Quantity is selected');
      return;
    }
    this.invoiceProducts[i].quantity -= 1;
  }

  // incrementQty
  incrementQuty(data: any, i: number) {
    console.log(data.quantity)
    console.log(data.maxQty)
    if(data.quantity >= data.maxQty){
      this.msg.create('warning','Maximum Quantity is selected');
      return;
    }
    this.invoiceProducts[i].quantity += 1;
  }
  close(){
    this.invoiceProducts = null;
    this.order = null;
  }

  getDue(){
    let due: Number = 0;
    let subTotal = this.calculateSubTotal();
    due =  subTotal + this.shippingCharge + this.adjustmentAmount - this.redeemedPoints - this.couponAmount;
    return due;
  }
}
