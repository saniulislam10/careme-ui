import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';

interface Person {
  key: string;
  ticketid: string;
  orderid: string;
  productsku: string;
  issuetype: string;
  message: string;
  status: number;
}

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss'],
})
export class TicketsPageComponent implements OnInit {
  @ViewChild('createTicket') createTicket: CreateTicketsComponent;
  isVisible = false;

  constructor() {}
  ticketModal(): void {
    this.isVisible = true;
  }
  ticketCancle(): void {
    this.isVisible = false;
  }
  listOfData: Person[] = [
    {
      key: '1',
      ticketid: '#TICKETID02',
      orderid: 'SO-2616493',
      productsku: '5072036',
      issuetype: 'Late delivery',
      message: 'Product delivery issue message',
      status: 1,
    },
    {
      key: '1',
      ticketid: '#TICKETID02',
      orderid: 'SO-2616493',
      productsku: '5072036',
      issuetype: 'Late delivery',
      message: 'Product delivery issue message',
      status: 0,
    },
    {
      key: '1',
      ticketid: '#TICKETID02',
      orderid: 'SO-2616493',
      productsku: '5072036',
      issuetype: 'Late delivery',
      message: 'Product delivery issue message',
      status: 0,
    },
  ];

  ngOnInit(): void {}
  /**
   * create
   */
  showPop() {
    this.createTicket.showPopUp();
  }
}
