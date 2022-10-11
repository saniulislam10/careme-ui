import { products } from './../../../../core/utils/dashboard.data';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Refund } from './../../../../interfaces/refund';
import { RefundService } from './../../../../services/refund.service';
import { FileUploadService } from './../../../../services/file-upload.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Invoice } from './../../../../interfaces/invoice';
import { Return } from './../../../../interfaces/return';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateReturnComponent } from 'src/app/shared/components/create-return/create-return.component';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ReturnService } from 'src/app/services/return.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  // @ViewChild('invoice') invoiceElement!: ElementRef;
  @ViewChild('createReturn') createReturn: CreateReturnComponent;
  invoice: Invoice;
  id: any;
  today = new Date();
  confirmModal?: NzModalRef;
  isVisible = false;
  checked = false;
  reason: string;
  notes: string;
  images: string[];
  paymentBy: String;
  paymentOption: String;
  phone: String;
  public dataForm: FormGroup;
  public products: FormArray;

  //subscription
  private subRouteOne?: Subscription;
  returnProducts: any[] = [];
  loading: boolean;
  file: FileList | any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private returnService: ReturnService,
    private refundService: RefundService,
    private spinner: NgxSpinnerService,
    private msg: NzMessageService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getInvoice();
      }
    });

  }

  onRefresh(){
    this.invoice = null;
    this.getInvoice();
  }

  initReturnForm() {
    this.dataForm = this.fb.group({
      products: this.fb.array([])
    });

    this.products = this.dataForm.get('products') as FormArray;
  }

  newProduct(data) {

    let newProduct = this.fb.group({
      name: [data.name],
      variant: [data.variant],
      sku: [data.sku],
      quantity: [data.quantity-data.returnedQuantity, Validators.required],
      totalInvoicedQty: [data.quantity, Validators.required],
      returnedQty: [data.returnedQuantity],
      recievedQty: [0],
      recieved: [false],
      price: [data.price],
      tax: [data.tax],
    })
    this.products.push(newProduct);
    console.log(this.products);
  }

  deleteFromReturn(i: number) {

    this.products.removeAt(i);
  }

  // get products() {
  //   return this.dataForm.get('products') as FormArray;
  // }


  public generatePDF(): void {
    this.spinner.show();
    let DATA: any = document.getElementById('invoice');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save(this.invoice.invoiceId + '.pdf');
      this.spinner.hide();
    });
  }

  getInvoice() {
    this.loading = true;
    this.invoiceService.getInvoiceById(this.id).subscribe(
      (res) => {
        this.invoice = res.data;
        this.loading = false;
        this.initReturnForm();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createReturnButton() {
    this.isVisible = true;
    this.invoice.products;
    this.setReturnProducts(this.invoice.products);

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    console.log(this.products.length);
  }
  handleOk() {
    console.log('Button ok clicked!');
    this.loading = true;
    this.placeReturn();

  }

  async fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files;
    console.log(this.file);
    this.fileUploadService.uploadMultiImageOriginal(this.file)
      .subscribe(res => {
        console.log(res.downloadUrls);
        this.msg.create('success', res.message);
      }, error => {
        console.log(error);
      });
  }

  changeEligibility() {
    this.checked = !this.checked;
  }

  placeReturn() {
    let returnId;
    let data = {
      invoiceId: this.invoice.invoiceId,
      orderNumber: this.invoice.orderNumber,
      returnDate: new Date(),
      customerName: this.invoice.customerName,
      billingAddress: this.invoice.billingAddress,
      shippingAddress: this.invoice.shippingAddress,
      subTotal: this.invoice.subTotal,
      adjustment: 0,
      deliveryFee: 120,
      total: this.invoice.total,
      products: this.dataForm.value.products,
      refundEligible: this.checked,
      reason: this.reason,
      notes: this.notes,
      images: this.images

    }
    this.returnService.placeReturn(data)
      .subscribe(res => {
        returnId = res.returnId
        let message = res.message + ". Return Id: " + res.returnId;
        this.msg.success(message, {
          nzDuration: 10000
        });
        if (this.checked) {
          this.createRefund(returnId);
        } else {
          this.onRefresh();
          this.loading = false;
          this.isVisible = false;
        }
      }, err => {
        this.msg.create('error', err.message);
      })
    return returnId;
  }

  createRefund(returnId) {

    let data: Refund = {
      invoiceId: this.invoice._id,
      returnId: returnId,
      orderNumber: this.invoice.orderNumber,
      customerName: this.invoice.customerName,
      products: this.returnProducts,
      paymentBy: this.paymentBy,
      paymentOptions: this.paymentOption,
      phoneNo: this.phone
    }
    this.refundService.add(data)
      .subscribe(res => {
        console.log(res.message)
        let message = res.message + ". Refund Id: " + res.refundId;
        this.msg.success(message, {
          nzDuration: 10000
        });
        this.onRefresh();
        this.loading = false;
        this.isVisible = false;
      }, err => {
        this.msg.create('error', err.message, {
          nzDuration: 5000
        });
        this.loading = false;
      })

  }

  setReturnProducts(products) {
    this.returnProducts = products;
    let length = this.products.length;
    for (let i = 0; i < length; i++) {
      this.deleteFromReturn(0);
    }
    for (let i = 0; i < this.returnProducts.length; i++) {
      this.newProduct(this.returnProducts[i]);
    }
  }

  getReturnProducts() {
    return this.returnProducts
  }

  onChangeQty(i, value, max, returnQty){

    console.log(value);
    console.log(this.products);

    if(returnQty){
      max = max - returnQty;
    }

    if(value > max){
      this.msg.create('warning','return quantity cannot be more than invoiced quantity');
      this.products.controls[i].patchValue(
        { quantity : max}
      )
    }else if (value < 0){
      this.msg.create('warning','value cannot be less than 1');
      this.products.controls[i].patchValue(
        { quantity : 0}
      )
    }
  }
}
