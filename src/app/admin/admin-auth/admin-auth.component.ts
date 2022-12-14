import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UiService } from '../../services/ui.service';
import { AdminService } from '../../services/admin.service';
import { Meta } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.component.html',
  styleUrls: ['./admin-auth.component.scss'],
})
export class AdminAuthComponent implements OnInit {
  // Reactive Form
  loginForm: FormGroup;
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  visibility: boolean = false;
  date = new Date();

  constructor(
    private uiService: UiService,
    private adminService: AdminService,
    private meta: Meta,
    private spinner: NgxSpinnerService
  ) {
    this.googleNoIndex();
  }

  ngOnInit(): void {
    // Main reactive form..
    this.loginForm = new FormGroup({
      username: this.username,
      password: this.password,
    });
  }

  visibilityChange() {
    this.visibility = !this.visibility;
  }

  // Main Login Method..
  onLogin() {
    if (this.loginForm.invalid) {
      this.uiService.wrong('Invalid Input field!');
      return;
    }
    // Spinner..
    this.spinner.show();
    // Form Data..
    const username = this.loginForm.value.username.trim().toLowerCase();
    const password = this.loginForm.value.password;

    const data = { username, password };

    this.adminService.adminLogin(data);
  }

  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
    this.meta.updateTag({ name: 'googlebot', content: 'noindex' });
  }
}
