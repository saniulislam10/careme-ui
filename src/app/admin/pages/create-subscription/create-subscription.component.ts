import { EditOptionComponent } from './edit-option/edit-option.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-create-subscription',
  templateUrl: './create-subscription.component.html',
  styleUrls: ['./create-subscription.component.scss']
})
export class CreateSubscriptionComponent implements OnInit {
  @ViewChild('edit') edit:EditOptionComponent;

  constructor() { }

  ngOnInit(): void {
  }
  /**** edit pop up show */
  editPOpUpShow(){
    this.edit.edit = true;
  }


}
