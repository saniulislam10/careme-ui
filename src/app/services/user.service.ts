import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {UiService} from './ui.service';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {User} from '../interfaces/user';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartService} from './cart.service';
import {ProductService} from './product.service';
import {AngularFireAuth} from '@angular/fire/auth';
// import firebase from 'firebase';
// import auth = firebase.auth;
import {BulkSmsService} from './bulk-sms.service';
import {MatDialog} from "@angular/material/dialog";
import { ReloadService } from './reload.service';

const API_USER = environment.apiBaseLink + '/api/user/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private token: string;
  private isUser = false;
  private userStatusListener = new Subject<boolean>();
  // Hold The Count Time..
  private tokenTimer: any;

  constructor(
    private httpClient: HttpClient,
    private uiService: UiService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private cartService: CartService,
    private productService: ProductService,
    private reloadService: ReloadService,
    // private afAuth: AngularFireAuth,
    private bulkSmsService: BulkSmsService,
    private matDialog: MatDialog
  ) {
  }

  /**
   * USER REGISTRATION
   */

  userRegistration(data: User, redirectForm?: string) {
    console.log("registration", data);

    this.httpClient.post<{ success: boolean; message: string; token: string; expiredIn: number }>
    (API_USER + 'registration', data)
      .subscribe(res => {
        console.log("registration res", res);

        if (res.success) {
          this.token = res.token;
          // Make User Auth True..
          this.spinner.hide();
          if (res.token) {
            this.onSuccessLogin(res.token, res.expiredIn, redirectForm, true);
            this.matDialog.closeAll()
          }

          this.bulkSmsService.sendMessageWithSubscribe(
            '88' + data.phoneNo,
            `Dear ${data.fullName}, Welcome to CareMe BD. Enjoy authentic home appliances at country’s most trusted electronics store www.caremebd.com. Hotline: 8801687248923.`
          );
        } else {
          this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          this.spinner.hide();
        }
      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  userLogin(data: { username: string, password: string }, redirectFrom?: string) {

    this.httpClient.put<{ success: boolean; message: string; token: string; expiredIn: number }>
    (API_USER + 'login', data)
      .subscribe(res => {
        if (res.success) {
          this.token = res.token;
          // Make User Auth True..
          if (res.token) {
            this.onSuccessLogin(res.token, res.expiredIn, redirectFrom);
          }
        } else {
          this.uiService.wrong(res.message);
          this.isUser = false;
          this.userStatusListener.next(false);
          this.spinner.hide();
        }

      }, () => {
        this.isUser = false;
        this.userStatusListener.next(false);
        this.spinner.hide();
      });
  }

  /**
   * ON SUCCESS LOGIN
   */

  private onSuccessLogin(token: string, expiredIn: number, redirectFrom?: string, fromRegistration?: boolean) {
    this.isUser = true;
    this.userStatusListener.next(true);

    // For Token Expired Time..
    const expiredInDuration = expiredIn;
    this.setSessionTimer(expiredInDuration);

    // Save Login Time & Expiration Time & Token to Local Storage..
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiredInDuration * 1000);
    this.saveUserData(token, expirationDate);

    // Snack bar..
    this.uiService.success('Welcome! Login Success.');
    // Spinner
    this.spinner.hide();

    // SYNC CART ITEM
    this.getCarsItemFromLocal();
    this.reloadService.needRefreshUser$();
    // Navigate with Auth..
    // if (redirectFrom) {
    //   // this.router.navigate([redirectFrom]);
    //   this.router.navigate(['']);
    // } else {
    //   this.router.navigate([environment.userBaseUrl]);
    // }
  }


  /**
   * FIREBASE LOGIN
   */

  // AuthLogin(provider, loginType: string) {
  //   return this.afAuth.signInWithPopup(provider)
  //     .then((credential) => {
  //       const user: User = {
  //         fullName: credential.user.displayName,
  //         username: credential.user.uid,
  //         password: null,
  //         phoneNo: credential.user.phoneNumber,
  //         profileImg: credential.user.phoneNumber,
  //         isPhoneVerified: false,
  //         isEmailVerified: false,
  //         email: credential.user.email,
  //         hasAccess: true,
  //         registrationType: loginType,
  //         points: 0,
  //         redeemedPoints: 0,
  //         earnedPoints: 0,
  //         totalReturn: 0,
  //         totalReturnAmount: 0,
  //       };
  //       this.firebaseLoginWithMongo(user);
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  // }

  // FacebookAuth() {
  //   return this.AuthLogin(new auth.FacebookAuthProvider(), 'facebook');
  // }

  // GoogleAuth() {
  //   return this.AuthLogin(new auth.GoogleAuthProvider(), 'google');
  // }

  // firebaseLoginWithMongo(credential: User) {
  //   this.httpClient.post<{ token: string, expiredIn: number }>(API_USER + 'firebase-login', credential)
  //     .subscribe((res) => {
  //       const getToken = res.token;
  //       this.token = getToken;
  //       // Make User Auth True..
  //       if (getToken) {
  //         this.onSuccessLogin(getToken, res.expiredIn);
  //       }
  //     }, (err) => {
  //       this.isUser = false;
  //       this.userStatusListener.next(false);
  //       console.log(err);
  //     });
  // }



  /**
   * User Auto Login
   */
  autoUserLoggedIn() {
    const authInformation = this.getUserData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expiredDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userStatusListener.next(true);
      this.isUser = true;
      this.setSessionTimer(expiresIn / 10000);
    }
  }

  /**
   * AUTH SESSION
   * SAVE USER DATA
   * CLEAR USER DATA
   */

  private setSessionTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
    }, duration * 1000);
  }

  protected saveUserData(token: string, expiredDate: Date) {
    localStorage.setItem(DATABASE_KEY.loginToken, token);
    localStorage.setItem(DATABASE_KEY.loggInSession, expiredDate.toISOString());
  }

  protected getUserData() {
    const token = localStorage.getItem(DATABASE_KEY.loginToken);
    const expirationDate = localStorage.getItem(DATABASE_KEY.loggInSession);

    if (!token && !expirationDate) {
      return;
    }
    return {
      token,
      expiredDate: new Date(expirationDate)
    };
  }

  protected clearUserData() {
    localStorage.removeItem(DATABASE_KEY.loginToken);
    localStorage.removeItem(DATABASE_KEY.loggInSession);
  }


  /**
   * MIDDLEWARE OF AUTH STATUS
   */
  getUserToken() {
    return this.token;
  }

  getUserStatusListener() {
    return this.userStatusListener.asObservable();
  }

  getUserStatus() {
    return this.isUser;
  }


  /**
   * User Logout
   */
  userLogOut() {
    this.token = null;
    this.isUser = false;
    this.userStatusListener.next(false);
    // Clear Token from Storage..
    this.clearUserData();
    // Clear The Token Time..
    clearTimeout(this.tokenTimer);
    // Navigate..
    // this.router.navigate([environment.appBaseUrl]);
  }


  /**
   * CHECK USER PHONE
   */

  checkAndGetUserByPhone(phoneNo: string) {
    return this.httpClient.get<{ data: boolean, message: string }>(API_USER + 'check-user-by-phone/' + phoneNo);
  }

  /**
   * CART SYNC FROM LOCAL
   */
  private getCarsItemFromLocal() {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            const cartsItems = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            this.uiService.openCartViewDialog(cartsItems);
          }
        });
    }
  }

  /**
   * EDIT PASSWORD
   */
  // editPassword(data: any) {
  //   return this.httpClient.post<{ message: string }>(API_USER + 'edit-password', data);
  // }

  updatePassword(data: any) {
    return this.httpClient.post<{ success: boolean; message: string }>(API_USER + 'update-password', data);
  }



}
