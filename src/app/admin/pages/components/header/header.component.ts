import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdminService } from '../../../../services/admin.service';
import { Admin } from '../../../../interfaces/admin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
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
