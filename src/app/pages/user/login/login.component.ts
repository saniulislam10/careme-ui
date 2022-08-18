import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../services/utils.service';
import { UiService } from '../../../services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public formData: FormGroup;

  isHiddenPass = true;

  constructor(
    public userService: UserService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private uiService: UiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.spinner.hide();
    this.formData = this.fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }
    const isValidUsername = this.utilsService.checkValidPhone(
      this.formData.value.username
    );
    if (!isValidUsername) {
      this.formData.get('username').setErrors({ invalid: true });
      this.uiService.warn('Please enter a valid phone number');
      return;
    }
    if (this.formData.value.password.length < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }
    this.spinner.show();
    this.userService.userLogin(this.formData.value, this.router.url);
  }
}
