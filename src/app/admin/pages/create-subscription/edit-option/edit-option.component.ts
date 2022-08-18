import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-option',
  templateUrl: './edit-option.component.html',
  styleUrls: ['./edit-option.component.scss']
})
export class EditOptionComponent implements OnInit {
  edit =false;
  constructor() { }

  ngOnInit(): void {
  }
  editPopUpHide(){
    this.edit = false;
  }
}
