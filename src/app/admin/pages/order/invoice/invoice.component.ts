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

  //subscription
  private subRouteOne?: Subscription;
  returnProducts: any;
  loading: boolean;
  file: FileList | any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private returnService: ReturnService,
    private spinner: NgxSpinnerService,
    private msg: NzMessageService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getInvoice();
      }
    });
  }

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
      PDF.save('INV-' + this.invoice.invoiceId + '.pdf');
      this.spinner.hide();
    });
  }

  getInvoice() {
    this.invoiceService.getInvoiceById(this.id).subscribe(
      (res) => {
        this.invoice = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  createReturnButton() {
    this.isVisible = true;
    this.returnProducts = this.invoice.products;

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
  handleOk(){
    console.log('Button ok clicked!');
    this.loading = true;
    let returnData:Return = {
      invoiceId: this.invoice._id,
      orderNumber: this.invoice.orderNumber,
      returnDate: new Date(),
      customerName: this.invoice.customerName,
      billingAddress: this.invoice.billingAddress,
      shippingAddress: this.invoice.shippingAddress,
      subTotal: this.invoice.subTotal,
      adjustment: 0,
      deliveryFee: 120,
      total: this.invoice.total,
      products: this.returnProducts
    }
    this.returnService.placeReturn(returnData)
    .subscribe(res => {
      console.log(res.message)
      this.loading = false;
      this.isVisible = false;
      let message = res.message + ". Return Id: "+ res.returnId;
      this.msg.success(message, {
        nzDuration: 10000
      });
    }, err=>{
      this.msg.create('error',err.message);
    })
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

  changeEligibility(){
    this.checked = !this.checked;
  }




}
