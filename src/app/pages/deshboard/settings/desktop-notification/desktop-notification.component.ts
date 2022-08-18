import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-desktop-notification',
  templateUrl: './desktop-notification.component.html',
  styleUrls: ['./desktop-notification.component.scss']
})
export class DesktopNotificationComponent implements OnInit {
  panelOpenState = false;

  constructor() { }

  ngOnInit(): void {
  }

}
