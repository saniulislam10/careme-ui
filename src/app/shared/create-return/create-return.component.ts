import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-return',
  templateUrl: './create-return.component.html',
  styleUrls: ['./create-return.component.scss']
})
export class CreateReturnComponent implements OnInit {

  createReturn = false;

  constructor() { }

  ngOnInit(): void {
  }
  /***
   * Create return popup controll
   */
  createReturnHide(){
    this.createReturn = false;
  }
  createReturnShow(){
    this.createReturn = true;
  }

}
