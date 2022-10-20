import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Admin } from '../../../../interfaces/admin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  notification = [
    {
      notification: 'New order (#SO009) place successfully',
      image:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      time: '5m ago',
    },
    {
      notification: 'Invoice (#INV0045) create successfully',
      image:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      time: '11m ago',
    },
    {
      notification: 'New return (#INV0045) created by Rahul',
      image:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      time: '5m ago',
    },
    {
      notification: 'This is notification text',
      image:
        'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      time: '5m ago',
    },
  ];

  @Output() sidenavNavToggle = new EventEmitter();

  adminData: Admin = null;
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.getUserData();
  }

  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }

  adminLogOut() {
    this.adminService.adminLogOut();
  }

  /**
   * HTTP Requested Data
   */
  private getUserData() {
    this.adminService.getAdminShortData().subscribe((res) => {
      this.adminData = res.data;
    });

    const children: Array<{ label: string; value: string }> = [];
    for (let i = 0; i < 5; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }
}
