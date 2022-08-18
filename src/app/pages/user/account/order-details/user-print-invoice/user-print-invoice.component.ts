import {Component, Input, OnInit} from '@angular/core';
import {Order} from '../../../../../interfaces/order';

@Component({
  selector: 'app-user-print-invoice',
  templateUrl: './user-print-invoice.component.html',
  styleUrls: ['./user-print-invoice.component.scss']
})
export class UserPrintInvoiceComponent implements OnInit {

  @Input() order: Order = null;

  constructor() { }

  ngOnInit(): void {
  }

}
