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

  showOtpSection = false;

  // Counter
  countDown = 0;
  timeInstance = null;

  expireCountDown = 0;
  timeInstanceExpire = null;
  otpMatched = false;

  // OTP
  generatedOtpCode: string;

  // Static Data
  genders: Select[] = GENDERS;

  // Modified Phone Number
  mPhoneNumber: string = null;
  verificationForm: FormGroup;

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
    this.initVerificationForm();
    this.dataForm = this.fb.group({
      phoneNo: [null, Validators.required],
    });
  }

  onSubmitForm() {
    this.showOtpSection = true;
    console.log("this.dataForm ", this.dataForm.value);

    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.uiService.warn('Please complete all the required field');
      return;
    }

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

    this.checkAndGetUserByPhone(this.mPhoneNumber);
  }

  /**
   * HTTP REQ HANDLE
   */

  /**
   * BULK SMS
   */
  private sentSingleBulkSms(phoneNumber) {

    this.countOtpExpireTime(300);
    this.countResendTime(60);
    this.generatedOtpCode = this.utilsService.getRandomOtpCode4();
    const message =
      this.generatedOtpCode +
      ' is your OTP (One-Time Password) for Care Me. OTP will expire in 5 minutes.';

    console.log(message)
    this.bulkSmsService.sentSingleBulkSms(phoneNumber, message).subscribe(
      (res) => {
        this.isLoading = false;
        this.spinner.hide();
      },
      (error) => {
        this.isLoading = false;
        this.uiService.wrong('Something went wrong! Please try again.');
        this.spinner.hide();
      }
    );
  }

  private checkAndGetUserByPhone(phoneNo: string) {
    this.userService.checkAndGetUserByPhone(phoneNo).subscribe(
      (res) => {
        const status = res.data;
        if (!status) {
          this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
          this.sentSingleBulkSms(phoneNo);
        } else {
          this.isLoading = false;
          this.spinner.hide();
          this.sentSingleBulkSms(phoneNo);
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
  // public openComponentDialog() {
  //   const mData = {
  //     otpCode: this.generatedOtpCode,
  //     phoneNo: this.mPhoneNumber,
  //   };
  //   const dialogRef = this.dialog.open(PhoneVerificationDialogComponent, {
  //     data: mData,
  //     panelClass: ['theme-dialog', 'dialog-no-radius', 'small-padding-sm'],
  //     width: '95%',
  //     maxWidth: '1080px',
  //     autoFocus: false,
  //     disableClose: true,
  //   });

  //   dialogRef.afterClosed().subscribe((dialogResult) => {

  //     if (dialogResult.regProgress) {
  //       console.log('OTP matched');
  //       this.spinner.show();
  //       const registrationData = {
  //         fullName: null,
  //         phoneNo: this.mPhoneNumber,
  //         email: null,
  //         password: null,
  //         gender: null,
  //         isPhoneVerified: true,
  //         registrationType: 'phone',
  //         isEmailVerified: false,
  //         hasAccess: true,
  //         username: this.mPhoneNumber,
  //         status: UserStatus.ACTIVE,
  //         shippingAddress: null,
  //         points: 0,
  //         redeemedPoints: 0,
  //         earnedPoints: 0,
  //         totalReturn: 0,
  //         totalReturnAmount: 0,
  //         registrationAt: this.getDate(),
  //       };
  //       console.log('registrationData',registrationData);
  //       this.userService.userRegistration(registrationData, this.router.url);
  //     } else {
  //       console.log('OTP not matched or closed dialog');
  //     }
  //   });
  // }

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

  initVerificationForm(){
    this.verificationForm = this.fb.group({
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
    });
  }

  nextStep(event, step: number): void {
    if (this.verificationForm.valid) {
      this.onSubmit();
    }
    const prevElement = document.getElementById('code' + (step - 1));
    const nextElement = document.getElementById('code' + (step + 1));
    if (event.code === 'Backspace' && event.target.value === '') {
      // event.target.parentElement.parentElement.children[step - 2 > 0 ? step - 2 : 0].children[0].value = ''
      if (prevElement) {
        prevElement.focus();
        return;
      }
    } else {
      if (nextElement) {
        nextElement.focus();
        return;
      } else {

      }
    }


  }

  onSubmit(): void {
    if (this.verificationForm.invalid) {
      return;
    }
    const code = this.verificationForm.value.code1 +
      this.verificationForm.value.code2 +
      this.verificationForm.value.code3 +
      this.verificationForm.value.code4

    this.verifyOtpCode(code);

  }

  verifyOtpCode(code: string) {
    if (this.generatedOtpCode) {
      if (code === this.generatedOtpCode) {
        console.log("Otp matched")
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
        this.uiService.wrong('Your OTP code is incorrect!');
      }
    } else {
      this.uiService.wrong('Your OTP code is expired! Please try again');
    }
  }

  focused(step) {
    if (step === 2) {
      if (this.verificationForm.controls.code1.value === '') {
        document.getElementById('code1').focus();
      }
    }
    if (step === 3) {
      if (this.verificationForm.controls.code1.value === '' || this.verificationForm.controls.code2.value === '') {
        document.getElementById('code2').focus();
      }
    }

    if (step === 4) {
      if (this.verificationForm.controls.code1.value === '' || this.verificationForm.controls.code2.value === '' || this.verificationForm.controls.code3.value === '') {
        document.getElementById('code3').focus();
      }
    }
  }

  paste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    this.verificationForm.setValue({
      code1: pastedText.charAt(0),
      code2: pastedText.charAt(1),
      code3: pastedText.charAt(2),
      code4: pastedText.charAt(3)
    });
    this.onSubmit();
  }

  countResendTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
      }
    };

    this.timeInstance = setInterval(count(time), 1000);
  }

  countOtpExpireTime(time: number) {
    const count = (num) => () => {
      this.expireCountDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstanceExpire);
        this.expireCountDown = 0;
        this.generatedOtpCode = null;
      }
    };

    this.timeInstanceExpire = setInterval(count(time), 1000);
  }

  resendLoginCode() {
    clearInterval(this.timeInstance);
    clearInterval(this.timeInstanceExpire);
    this.sendLoginCode();
  }

  sendLoginCode() {
    // Create Message Data
    const finalPhoneNo = this.mPhoneNumber;
    this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
    // Sent Message
    this.sentSingleBulkSms(finalPhoneNo);
  }


  ngOnDestroy() {}

}
