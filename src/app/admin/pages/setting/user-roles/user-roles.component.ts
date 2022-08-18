import { InviteUserComponent } from './invite-user/invite-user.component';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss']
})
export class UserRolesComponent implements OnInit {
  @ViewChild('inviteUser') invite:InviteUserComponent;

  constructor() { }

  ngOnInit(): void {
  }
  /**** edit pop up show */
  invitePOpUpShow(){
    this.invite.invite = true;
  }
}
