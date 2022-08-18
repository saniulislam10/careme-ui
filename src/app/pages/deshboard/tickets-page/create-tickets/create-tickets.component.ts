import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-tickets',
  templateUrl: './create-tickets.component.html',
  styleUrls: ['./create-tickets.component.scss']
})
export class CreateTicketsComponent implements OnInit {

  popUp = false;

  constructor() { }

  ngOnInit(): void {
  }
/***
 * PopUp
 */
  showPopUp(){
    this.popUp = true;
  }
  hidePopUp(){
    this.popUp = false;
  }
}
