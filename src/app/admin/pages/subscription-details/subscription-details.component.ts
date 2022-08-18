import { EditComponent } from './edit/edit.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {
  @ViewChild('edit') edit:EditComponent;

  constructor() { }

  ngOnInit(): void {
  }
  /**** edit pop up show */
  editPOpUpShow(){
    this.edit.edit = true;
  }

}
