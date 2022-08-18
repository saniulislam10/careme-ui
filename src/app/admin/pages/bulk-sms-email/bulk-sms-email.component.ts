import { CreateSmsGroupComponent } from './create-sms-group/create-sms-group.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-bulk-sms-email',
  templateUrl: './bulk-sms-email.component.html',
  styleUrls: ['./bulk-sms-email.component.scss']
})
export class BulkSmsEmailComponent implements OnInit {
  @ViewChild('smsgroup') smsGroup:CreateSmsGroupComponent;

  constructor() { }

  ngOnInit(): void {
  }

  popUpShow(){
    this.smsGroup.popup = true;
  }

}
