import { Component, OnInit } from '@angular/core';
import {User} from '../../../../interfaces/user';
import {MatDialog} from '@angular/material/dialog';
import {UserDataService} from '../../../../services/user-data.service';
import {ReloadService} from '../../../../services/reload.service';
import {EditBasicInfoComponent} from '../../../../shared/dialog-view/edit-basic-info/edit-basic-info.component';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  user: User = null;

  constructor(
    private dialog: MatDialog,
    protected userDataService: UserDataService,
    private reloadService: ReloadService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshUser$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();
  }

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  openNewDialog() {
    this.dialog.open(EditBasicInfoComponent, {
      data: this.user,
      panelClass: ['theme-dialog'],
      height: '60%',
      autoFocus: false,
      disableClose: false
    });
  }

}
