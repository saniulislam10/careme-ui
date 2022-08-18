import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-sms-group',
  templateUrl: './create-sms-group.component.html',
  styleUrls: ['./create-sms-group.component.scss']
})
export class CreateSmsGroupComponent implements OnInit {
  popup = false;

  constructor() { }

  ngOnInit(): void {
  }

  popUpHide(){
    this.popup = false;
  }

}
