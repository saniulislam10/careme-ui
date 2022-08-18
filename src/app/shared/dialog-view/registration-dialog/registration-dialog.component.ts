import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Select} from "../../../interfaces/select";
import {GENDERS} from "../../../core/utils/app-data";
import {UserService} from "../../../services/user.service";
import {UiService} from "../../../services/ui.service";
import {NgxSpinnerService} from "ngx-spinner";
import {UtilsService} from "../../../services/utils.service";
import {BulkSmsService} from "../../../services/bulk-sms.service";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {
  PhoneVerificationDialogComponent
} from "../../lazy-component/phone-verification-dialog/phone-verification-dialog.component";
import {UserStatus} from "../../../enum/user-status";

@Component({
  selector: 'app-registration-dialog',
  templateUrl: './registration-dialog.component.html',
  styleUrls: ['./registration-dialog.component.scss']
})
export class RegistrationDialogComponent implements OnInit {

  public dataForm: FormGroup;
  isLoading = false;

  isHiddenPass = true;
  isHiddenConPass = true;

  // OTP
  generatedOtpCode: string;

  // Static Data
  genders: Select[] = GENDERS;

  // Modified Phone Number
  mPhoneNumber: string = null;

  constructor(
    public userService: UserService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private bulkSmsService: BulkSmsService,
    public dialog: MatDialog,
    private router: Router,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.spinner.hide();
    this.dataForm = this.fb.group({
      phoneNo: [null, Validators.required],
      // email: [null, [Validators.email]],
      // password: [null, Validators.required],
      // confirmPassword: [null, Validators.required],
      // fullName: [null, Validators.required],
      // gender: [null, Validators.required],
      // agree: [true, Validators.required],
    });
  }

  onSubmitForm() {
    console.log("this.dataForm ", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.uiService.warn('Please complete all the required field');
      return;
    }

    // if (this.dataForm.value.password !== this.dataForm.value.confirmPassword) {
    //   this.uiService.warn('Password and confirm password not matched');
    //   return;
    // }

    // if (this.dataForm.value.phoneNo.length === 10) {
    //   this.dataForm.get('phoneNo').setErrors({invalid: true});
    //   this.uiService.warn('Please enter a valid 11 digit phone no');
    //   return;
    // }

    // if (this.dataForm.value.password.length < 6) {
    //   this.uiService.warn('Password must be at lest 6 characters!');
    //   return;
    // }

    if (this.dataForm.value.phoneNo.length === 10) {
      this.mPhoneNumber = '880' + this.dataForm.value.phoneNo;
    } else if (this.dataForm.value.phoneNo.length === 11) {
      this.mPhoneNumber = '88' + this.dataForm.value.phoneNo;
    } else {
      this.dataForm.get('phoneNo').setErrors({ invalid: true });
      this.uiService.warn('Please enter a valid 11 digit phone no');
      return;
    }

    this.isLoading = true;

    // this.sentSingleBulkSms(this.mPhoneNumber);
    // this.spinner.show();

    this.checkAndGetUserByPhone(this.dataForm.value.phoneNo);
  }

  /**
   * HTTP REQ HANDLE
   */

  /**
   * BULK SMS
   */
  private sentSingleBulkSms(phoneNumber) {

    this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
    console.log(this.generatedOtpCode);
    const message =
      this.generatedOtpCode +
      ' is your OTP (One-Time Password) for CaremeBd. OTP will expire in 5 minutes.';


    this.bulkSmsService.sentSingleBulkSms(phoneNumber, message).subscribe(
      (res) => {
        console.log("bulk res", res);

        this.isLoading = false;
        this.spinner.hide();
        if (res.success) {
          this.openComponentDialog();
        } else {
          this.isLoading = false;
          this.spinner.hide();
          this.uiService.wrong('Something went wrong! Please try again.');
        }
      },
      (error) => {
        this.isLoading = false;
        this.uiService.wrong('Something went wrong! Please try again.');
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  private checkAndGetUserByPhone(phoneNo: string) {
    this.userService.checkAndGetUserByPhone(phoneNo).subscribe(
      (res) => {
        const status = res.data;
        if (!status) {
          // Create Message Data
          const finalPhoneNo = '880' + this.dataForm.value.phoneNo;
          this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
          const message =
            this.generatedOtpCode +
            ' is your OTP (One-Time Password) for E-medilife. OTP will expire in 5 minutes.';
          // Sent Message
          this.sentSingleBulkSms(finalPhoneNo);
        } else {
          this.isLoading = false;
          this.spinner.hide();
          this.uiService.warn('This phone no is already registered');
          this.dataForm.get('phoneNo').setErrors({ invalid: true });
          this.dataForm.get('phoneNo').markAsTouched({ onlySelf: true });
        }
      },
      (error) => {
        this.isLoading = false;
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  /**
   *  COMPONENT DIALOG
   */
  public openComponentDialog() {
    console.log("open component");

    const mData = {
      otpCode: this.generatedOtpCode,
      phoneNo: this.mPhoneNumber,
    };
    const dialogRef = this.dialog.open(PhoneVerificationDialogComponent, {
      data: mData,
      panelClass: ['theme-dialog', 'dialog-no-radius', 'small-padding-sm'],
      width: '95%',
      maxWidth: '1080px',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {

      if (dialogResult.regProgress) {
        console.log('OTP matched');
        this.spinner.show();
        const registrationData = {
          fullName: null,
          phoneNo: this.mPhoneNumber,
          email: null,
          password: null,
          gender: null,
          isPhoneVerified: true,
          registrationType: 'phone',
          isEmailVerified: false,
          hasAccess: true,
          username: this.mPhoneNumber,
          status: UserStatus.ACTIVE,
          shippingAddress: null,
          points: 0,
          redeemedPoints: 0,
          earnedPoints: 0,
          totalReturn: 0,
          totalReturnAmount: 0,
          registrationAt: this.getDate(),
        };
        console.log('registrationData',registrationData);
        this.userService.userRegistration(registrationData, this.router.url);
      } else {
        console.log('OTP not matched or closed dialog');
      }
    });
  }

  getDate() {
    var today = new Date();
    let month =
      today.getMonth() + 1 > 9
        ? today.getMonth() + 1
        : '0' + (today.getMonth() + 1);
    let dateRn =
      today.getDate() + 1 > 9
        ? today.getDate() + 1
        : '0' + (today.getDate() + 1);
    var date = today.getFullYear() + '-' + month + '-' + dateRn;
    return date;
  }
  ngOnDestroy() {}

}
