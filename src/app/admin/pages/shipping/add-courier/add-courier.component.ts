import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-courier',
  templateUrl: './add-courier.component.html',
  styleUrls: ['./add-courier.component.scss']
})
export class AddCourierComponent implements OnInit {
  curierPopUp = false;
  constructor() { }

  ngOnInit(): void {
  }
  popUpHide(){
    this.curierPopUp = false;
  }

}
