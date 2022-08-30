import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.scss']
})
export class DeshboardComponent implements OnInit {
  deshMenu = false;
  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
    sub3: false
  };

  constructor() { }

  ngOnInit(): void {
  }


  sideMenuActive(){
    this.deshMenu = true;
  }
  sideMenuInactive(){
    this.deshMenu = false;
  }

  openHandler(value: string): void {
    for (const key in this.openMap) {
      if (key !== value) {
        this.openMap[key] = false;
      }
    }
  }

}
