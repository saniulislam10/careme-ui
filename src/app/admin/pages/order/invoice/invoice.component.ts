import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { InvoiceService } from 'src/app/services/invoice.service';
import { products } from '../../../../core/utils/dashboard.data';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoice: any;
  id: any;
  today = new Date();

  //subscription
  private subRouteOne?: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getInvoice();
      }
    });
  }

  getInvoice() {
    this.invoiceService.getInvoiceById(this.id)
    .subscribe(res => {
      this.invoice = res.data;
      console.log("invoice", this.invoice);

    }, err=>{
      console.log(err);
    });
  }

  paidAmmount() {
    let total = 0;
    for (let i = 0; i < this.invoice?.products.length; i++) {
      total +=this.invoice?.products[i].advance
    }
    return total;
  }
}

