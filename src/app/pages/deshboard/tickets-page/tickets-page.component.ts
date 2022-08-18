import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateTicketsComponent } from './create-tickets/create-tickets.component';

@Component({
  selector: 'app-tickets-page',
  templateUrl: './tickets-page.component.html',
  styleUrls: ['./tickets-page.component.scss']
})
export class TicketsPageComponent implements OnInit {
  @ViewChild("createTicket") createTicket: CreateTicketsComponent;

  constructor() { }

  ngOnInit(): void {
  }
  /**
   * create
   */
  showPop(){
    this.createTicket.showPopUp();
  }

}
