import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
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
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
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
