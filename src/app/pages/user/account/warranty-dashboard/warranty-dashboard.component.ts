import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {Warranty} from '../../../../interfaces/warranty';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {UiService} from '../../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BulkSmsService} from '../../../../services/bulk-sms.service';
import {BulkSms} from '../../../../interfaces/bulk-sms';
import {UtilsService} from '../../../../services/utils.service';
import {WarrantyService} from '../../../../services/warranty.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-warranty-dashboard',
  templateUrl: './warranty-dashboard.component.html',
  styleUrls: ['./warranty-dashboard.component.scss']
})
export class WarrantyDashboardComponent implements OnInit, OnDestroy {

  private readonly fonts = {
    Roboto: {
      normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
  };

  // Dummy Data
  warranties: Warranty[] = [];
  customerPhoneNo: string = null;

  // Form
  dataForm: FormGroup;
  @ViewChild('formElement') formElement: NgForm;


  // Verification
  otp: string = null;
  otpMatched = false;
  timeInstance = null;
  generatedOtpCode: string;
  expireCountDown = 0;
  timeInstanceExpire = null;
  countDown = 0;
  sendVerificationCode = false;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 4;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private bulkSmsService: BulkSmsService,
    private utilsService: UtilsService,
    private warrantyService: WarrantyService,
  ) {
  }

  ngOnInit(): void {
    // Init Form
    this.initForm();
  }

  /**
   * INIT FORM
   */
  private initForm() {
    this.dataForm = this.fb.group({
      customerPhoneNo: [null, Validators.required]
    });
  }

  /**
   * ON SUBMIT
   */
  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }

    this.spinner.show();
    this.customerPhoneNo = this.dataForm.value.customerPhoneNo.trim();
    this.checkCustomerPhoneNoNumber();
  }

  /**
   * CHECK INVOICE
   */

  private checkCustomerPhoneNoNumber() {
    const data = {
      customerPhoneNo: this.customerPhoneNo
    };
    this.warrantyService.checkWarrantByCustomerPhoneNo(data)
      .subscribe(res => {
        if (res.success) {
          // Create Message Data
          const finalPhoneNo = this.customerPhoneNo.slice(0, 2) === '88' ? this.customerPhoneNo : '88' + this.customerPhoneNo;
          this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
          const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for password reset at Esquire Electronics. Please enter the OTP to the verification page. Thanks.';
          // Sent Message
          this.sendSmsBySslAPi(this.customerPhoneNo, message, finalPhoneNo);
        } else {
          this.spinner.hide();
          this.uiService.warn('No warranty data found in this phone number. Please contact with authorized person.');
        }
      }, error => {
        this.spinner.hide();
        this.uiService.wrong('Something went wrong. Please try again latter');
        console.log(error);
      });

  }


  /**
   * BULK SMS
   */
  private sendSmsBySslAPi(phoneNo: string, message: string, uid: string) {
    const messageBody: BulkSms = {
      sms: message,
      csmsid: uid,
      msisdn: phoneNo
    };
    this.bulkSmsService.sendSmsBySslAPi(messageBody)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.countTime(60);
          this.countOtpExpireTime(3000);
          this.sendVerificationCode = true;
        } else {
          this.spinner.hide();
          this.uiService.wrong('Something went wrong! Please try again.');
        }
      }, error => {
        this.spinner.hide();
        this.uiService.wrong('Something went wrong! Please try again.');
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * PHONE VERIFICATION
   */

  // Resent Verification Code...
  resendLoginCode() {
    clearInterval(this.timeInstance);
    clearInterval(this.timeInstanceExpire);
    // Create Message Data
    const finalPhoneNo = this.customerPhoneNo.slice(0, 2) === '88' ? this.customerPhoneNo : '88' + this.customerPhoneNo;
    this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
    const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for password reset at Esquire Electronics. Please enter the OTP to the verification page. Thanks.';
    // Sent Message
    this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
  }


  /**
   * VERIFY CODE
   */
  verifyOtpCode() {
    if (this.generatedOtpCode) {
      if (this.otp === this.generatedOtpCode) {
        const data = {
          customerPhoneNo: this.customerPhoneNo,
          select: '-createdAt -updatedAt -lastDownload -totalDownload',
          type: 'download'
        };
        this.warrantyService.getWarrantDataByCustomer(data)
          .subscribe(res => {
            this.spinner.hide();
            this.warranties = res.data;
            this.totalProducts = res.count;
            this.otpMatched = true;
            this.sendVerificationCode = false;
            this.otp = '';
            this.customerPhoneNo = null;
            this.formElement.resetForm();
          }, error => {
            this.spinner.hide();
            console.log(error);
          });
      } else {
        this.spinner.hide();
        this.uiService.wrong('Your OTP code is incorrect!');
      }
    } else {
      this.spinner.hide();
      this.uiService.wrong('Your OTP code is expired! Please try again');
    }
  }

  // CountDown...
  private countTime(time?) {
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

  private countOtpExpireTime(time: number) {
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

  onRecoverFormSubmit(form: NgForm): void {
    if (form.invalid) {
      this.uiService.warn('No OTP code entered!');
      return;
    }
    this.spinner.show();
    this.otp = form.value.otp;
    this.verifyOtpCode();
  }


  /**
   * PDG MAKE
   */
  generatePdf(data: Warranty) {
    this.spinner.show();
    const docDataRef = this.getPdfObjectData(data);
    this.warrantyService.trackWarrantDownloadHistory(data._id)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.uiService.success(`Successfully generate warranty data.`);
          pdfMake.createPdf(docDataRef, null, this.fonts).download(`Warranty_Document_By_Esquire_Electronics.pdf`);
        } else {
          this.uiService.warn('Something went wrong! Please try again');
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * PDF OBJECT
   */

  getPdfObjectData(warranty: Warranty) {
    return {
      content: [
        {
          text: 'WARRANTY DOCUMENT',
          style: ['header', 'center', 'underline', 'm4']
        },
        {
          text: `${warranty?.productName} ${warranty?.sku}`,
          style: ['header', 'center']
        },
        {
          text: warranty?.warrantyPeriod,
          style: ['textNormal', 'center']
        },
        {
          text: `Activation Date: ${this.utilsService.getDateString(new Date(warranty?.activationDate), 'LL')}`,
          style: ['textNormal', 'right', 'underline', 'my_4']
        },
        {
          text: [
            `This certificate acknowledges the purchase of ${warranty?.productName} ${warranty?.sku} by `,
            {text: `${warranty?.customerName} (${warranty?.customerPhoneNo}) `, bold: true},
            'from Esquire Electronics Limited. The Esquire invoice number for this purchase is ',
            {text: `${warranty?.invoiceNumber} `, bold: true},
            'and eligible for a limited warranty period of -'
          ],
          style: ['textNormal', 'my_4']
        },
        {
          text: warranty?.warrantyPeriod,
          style: ['titleBig', 'center', 'my_8']
        },
        {
          text: 'Valid and limited from the date of purchase / activation aforementioned, subject to complying with all the company terms and conditions listed below -',
          style: ['textNormal']
        },
        {
          text: 'Terms & Conditions:',
          fontSize: 10,
          bold: true,
          style: ['underline', 'my_4']
        },
        {
          ul: [
            'The product warranty does not extend to any goods that has been damaged or rendered defective as a result of accident, misuse or abuse or any other conditions, malfunctions not resulting from defects in material or workmanship.',
            'The limited warranty period does not cover any problem that is caused and occurred by natural calamities (Thunderstorm / Lightning), Product Modification, Circuit damage by voltage fluctuation.',
            'The limited warranty period will no longer be valid if the product is repaired or serviced by anyone other than Esquire Electronics Limited or its authorized service provider.',
            'No warranty applicable for component accessories, shelves, Door Lock, and other plastic accessories and cabinets.'
          ],
          margin: [16, 0, 0, 0],
          style: ['textNormal']
        },
        {
          text: 'GOODS ONCE SOLD CANNOT BE CHANGED OR RETURNED BACK FOR CASH',
          margin: [0, 20, 0, 20],
          fontSize: 12,
          bold: true,
          style: ['center']
        },
        {
          columns: [
            [
              {
                text: 'Service Center:',
                alignment: 'left',
                bold: true,
                fontSize: 10,
              },
              {
                text: 'Esquire Customer Care Limited',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: '260/A, Tejgaon I/A, Dhaka – 1208',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: 'Tel: 8809610001010',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: 'Email: ecommerce@esquirebd.com',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: ['Web: ', {text: 'www.esquireelectronicsltd.com', link: 'https://esquireelectronicsltd.com/', color: 'blue'}],
                alignment: 'left',
                fontSize: 10,
              },
            ],
            [
              {
                text: 'Corporate Office:',
                alignment: 'left',
                bold: true,
                fontSize: 10
              },
              {
                text: 'Esquire Tower',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: '21, Shaheed Tajuddin Ahmed Sharani, Tejgaon, Dhaka - 1208',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: 'Tel: 8809612345345',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: 'Email: ecommerce@esquirebd.com',
                alignment: 'left',
                fontSize: 10,
              },
              {
                text: ['Web: ', {text: 'www.esquireelectronicsltd.com', link: 'https://esquireelectronicsltd.com/', color: 'blue'}],
                alignment: 'left',
                fontSize: 10,
              },
            ],
          ],
          columnGap: 5,
          style: 'my_8'
        },
        {
          text: 'Printed Sept, 22, 2021',
          style: ['textNormal', 'right', 'my_8'],
          color: '#616161',
          fontSize: 8
        },
      ],
      info: {},
      styles: {
        header: {
          fontSize: 12,
          bold: true
        },
        textNormal: {
          fontSize: 10
        },
        titleBig: {
          fontSize: 14,
          bold: true
        },
        center: {
          alignment: 'center'
        },
        right: {
          alignment: 'right'
        },
        underline: {
          decoration: 'underline'
        },
        my_4: {
          margin: [0, 10, 0, 10]
        },
        my_8: {
          margin: [0, 16, 0, 16]
        },
        mx_4: {
          margin: [10, 0, 10, 0]
        },
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };
  }

  ngOnDestroy() {
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
    }

    if (this.timeInstanceExpire) {
      clearInterval(this.timeInstanceExpire);
    }

    this.otpMatched = false;
  }


  /**
   * ON PAGINATION CHANGE
   */
  onPageChanged(event: number) {
    this.currentPage = event;
  }

}
