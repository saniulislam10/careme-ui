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
import { OrderStatus } from 'src/app/enum/order-status';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  shippingCost= 120;
  date = new Date();


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
  saveButtonDisable: boolean = false;
  public dataForm: FormGroup;
  public products: FormArray;

  //subscription
  private subRouteOne?: Subscription;
  returnProducts: any[] = [];
  loading: boolean;
  file: FileList | any;
  markDisabled: Boolean = false;

  returns: Return[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private returnService: ReturnService,
    private refundService: RefundService,
    private spinner: NgxSpinnerService,
    private msg: NzMessageService,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getInvoice();
      }
    });
  }

  onRefresh() {
    this.invoice = null;
    this.getInvoice();
  }

  initReturnForm() {
    this.dataForm = this.fb.group({
      products: this.fb.array([]),
    });

    this.products = this.dataForm.get('products') as FormArray;
  }

  newProduct(data) {
    console.log('For return', data);

    let newProduct = this.fb.group({
      name: [data.name],
      variant: [data.variant],
      sku: [data.sku],
      totalInvoicedQty: [data.quantity, Validators.required],
      returnedQty: [data.returnedQuantity],
      quantity: [data.quantity - data.returnedQuantity, Validators.required],
      recievedQty: [0],
      recieved: [false],
      price: [data.price],
      tax: [data.tax],
    });
    this.products.push(newProduct);
    this.checkValue();
    console.log(this.products);
  }

  deleteFromReturn(i: number) {
    this.products.removeAt(i);
    this.checkValue();
  }

  // get products() {
  //   return this.dataForm.get('products') as FormArray;
  // }

  public generatePDF(): void {
    this.spinner.show();
    let DATA: any = document.getElementById('inv_print_section');
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
        if (this.invoice.deliveryStatus === OrderStatus.DELIVERED) {
          this.markDisabled = true;
        }
        this.getAllReturns(this.invoice.invoiceId);
        this.loading = false;
        this.initReturnForm();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAllReturns(id) {
    this.returnService.getReturnByInvoiceId(id).subscribe(
      (res) => {
        this.returns = res.data;
      },
      (err) => {
        this.msg.create('error', err.message);
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
  }
  handleOk() {
    console.log('Button ok clicked!');
    this.loading = true;
    this.placeReturn();
  }

  async fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files;
    this.fileUploadService.uploadMultiImageOriginal(this.file).subscribe(
      (res) => {
        console.log(res.downloadUrls);
        this.msg.create('success', res.message);
      },
      (error) => {
        console.log(error);
      }
    );
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
      deliveryStatus: OrderStatus.PENDING,
      total: this.invoice.total,
      products: this.dataForm.value.products,
      refundEligible: this.checked,
      reason: this.reason,
      notes: this.notes,
      images: this.images,
    };
    this.returnService.placeReturn(data).subscribe(
      (res) => {
        returnId = res.returnId;
        let message = res.message + '. Return Id: ' + res.returnId;
        this.msg.success(message, {
          nzDuration: 10000,
        });
        if (this.checked) {
          this.createRefund(returnId);
        } else {
          this.onRefresh();
          this.loading = false;
          this.isVisible = false;
        }
      },
      (err) => {
        this.msg.create('error', err.message);
      }
    );
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
      phoneNo: this.phone,
    };
    this.refundService.add(data).subscribe(
      (res) => {
        console.log(res.message);
        let message = res.message + '. Refund Id: ' + res.refundId;
        this.msg.success(message, {
          nzDuration: 10000,
        });
        this.onRefresh();
        this.loading = false;
        this.isVisible = false;
      },
      (err) => {
        this.msg.create('error', err.message, {
          nzDuration: 5000,
        });
        this.loading = false;
      }
    );
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
    return this.returnProducts;
  }

  onChangeQty(i, value, max, returnQty) {
    if (returnQty) {
      max = max - returnQty;
    }

    if (value > max) {
      this.msg.create(
        'warning',
        'return quantity cannot be more than invoiced quantity'
      );
      this.products.controls[i].patchValue({ quantity: max });
    } else if (value < 0) {
      this.msg.create('warning', 'value cannot be less than 1');
      this.products.controls[i].patchValue({ quantity: 0 });
    }
    this.checkValue();
  }

  checkValue() {
    this.saveButtonDisable = false;
    this.products.value.forEach((element) => {
      if (element.quantity === 0) {
        this.saveButtonDisable = true;
      }
    });
  }

  getRefundId(returnId) {
    this.refundService.getByReturnId(returnId).subscribe(
      (res) => {
        console.log(res.data);
        return res.data.refundId;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  markDelivered() {
    this.invoice.deliveryStatus = OrderStatus.DELIVERED;
    this.invoiceService.updateInvoiceById(this.invoice).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.markDisabled = true;
      },
      (err) => {
        this.msg.error(err.message);
      }
    );
  }

  // Payment
  paymentVisible = false;
  showPayment(): void {
    this.paymentVisible = true;
  }
  paymentOk(): void {
    console.log('Button ok clicked!');
    this.paymentVisible = false;
  }
  paymentCancel(): void {
    console.log('Button cancel clicked!');
    this.paymentVisible = false;
  }
  allDelivered(): void {
    this.modal.info({
      nzTitle: 'Delivered Invoice ? ',
      nzContent: '<p>Change your invoice status as delivered.</p>',
      nzOkText: 'Yes',
      nzOnOk: () => this.markDelivered()
    });
  }


  // Write Off
  writeOff = false;
  showWriteOff(): void {
    this.writeOff = true;
  }
  writeoffOk(): void {
    console.log('Button ok clicked!');
    this.writeOff = false;
  }
  writeoffCancel(): void {
    console.log('Button cancel clicked!');
    this.writeOff = false;
  }

  //  Delete Worning
  allDelete(): void {
    this.modal.warning({
      nzTitle: 'Want to Delete ? ',
      nzContent: '<p>Change your invoice status as delivered.</p>',
      nzOkText: 'Yes',
      nzOnOk: () => alert('Please Create a delete Function and replace this Alert Message')
    });
  }

//  Print Invoice
  invoicePrint(): void{
    window.print();
  }

}
