import { UserDataService } from 'src/app/services/user-data.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.scss'],
})
export class DeshboardComponent implements OnInit {
  deshMenu = false;
  openMap: { [name: string]: boolean } = {
    sub1: false,
    sub2: false,
    sub3: false,
  };

  visible = false;
  user: User;

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  constructor(
    private userDataService: UserDataService
  ) {}

  ngOnInit(): void {
    this.userDataService.getLoggedInUserInfo()
    .subscribe(res => {
      this.user = res.data;

    }, err=> {
      console.log(err.data);
    })
  }

  sideMenuActive() {
    this.deshMenu = true;
  }
  sideMenuInactive() {
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
