import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreateReturnComponent } from 'src/app/shared/components/create-return/create-return.component';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  // @ViewChild('invoice') invoiceElement!: ElementRef;
  @ViewChild('createReturn') createReturn: CreateReturnComponent;
  invoice: any;
  id: any;
  today = new Date();

  //subscription
  private subRouteOne?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private spinner: NgxSpinnerService
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
    this.createReturn.createReturnShow();

  }
}
