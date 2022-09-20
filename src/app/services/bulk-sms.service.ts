import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BulkSms} from '../interfaces/bulk-sms';


const API_BULK_SMS = environment.apiBaseLink + '/api/bulk-sms/';

@Injectable({
  providedIn: 'root'
})
export class BulkSmsService {

  constructor(
    private httpClient: HttpClient
  ) {
  }


  /**
   * BULK SMS BD
   * POWERED BY BULK SMS BD
   * URL: http://login.bulksmsbd.com/default.php
   */

  sentSingleBulkSms(phoneNo: string, message: string) {
    return this.httpClient.post<{ success: boolean; message: string }>(API_BULK_SMS + 'send-bulk-sms', {phoneNo, message});
  }


  /**
   * iSMS SSLWIRELESS
   * POWERED BY SSLWIRELESS
   * URL: http://login.bulksmsbd.com/default.php
   */


  sendSmsBySslAPi(data: BulkSms) {
    return this.httpClient.post<{ success: boolean; message: string; xmlRes: string }>
    (API_BULK_SMS + 'sent-bulk-sms-by-ssl', data);
  }

  /**
   * SENT MESSAGE With Subscribe
   */
  sendMessageWithSubscribe(phoneNo: string, message: string) {
    this.httpClient.post<{ success: boolean; message: string }>
    (API_BULK_SMS + 'send-bulk-sms', {phoneNo, message})
      .subscribe(res => {

      }, error => {
        console.log(error);
      });
  }


}
