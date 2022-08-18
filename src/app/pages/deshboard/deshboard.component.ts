import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.scss']
})
export class DeshboardComponent implements OnInit {
  deshMenu = false;

  constructor() { }

  ngOnInit(): void {
  }


  sideMenuActive(){
    this.deshMenu = true;
  }
  sideMenuInactive(){
    this.deshMenu = false;
  }

}
