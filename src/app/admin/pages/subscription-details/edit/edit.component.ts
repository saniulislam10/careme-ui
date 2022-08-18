import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  edit = false;
  constructor() { }

  ngOnInit(): void {
  }
  editPopUpHide(){
    this.edit = false;
  }

}
