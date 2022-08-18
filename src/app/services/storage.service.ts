import {Injectable} from '@angular/core';
import {EncryptStorage} from 'encrypt-storage';
import {CookieService} from 'ngx-cookie-service';
import {DATABASE_KEY} from '../core/utils/global-variable';
import {RecommendedProductData} from '../interfaces/recommendedProductsData';
import {environment} from '../../environments/environment';

// Encrypt
const encryptStorage = new EncryptStorage(environment.storageSecret);

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private cookieService: CookieService
  ) {
  }

  /**
   * SESSION STORAGE
   */

  storeDataToSessionStorage(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getDataFromSessionStorage(key: string): any {
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  }

  removeSessionData(key: string) {
    sessionStorage.removeItem(key);
  }


  /**
   * LOCAL STORAGE
   */

  storeDataToLocalStorage(data: any, key: string) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getDataFromLocalStorage(key: string): any {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  removeLocalData(key: string) {
    localStorage.removeItem(key);
  }


  /**
   * SESSION STORAGE
   */

  storeProductInputData(data: any) {
    sessionStorage.setItem(DATABASE_KEY.productFormData, JSON.stringify(data));
  }

  get storedProductInput(): any {
    const data = sessionStorage.getItem(DATABASE_KEY.productFormData);
    return JSON.parse(data);
  }

  storeCouponData(data: any) {
    sessionStorage.setItem(DATABASE_KEY.userCoupon, JSON.stringify(data));
  }

  get storedCouponData(): any {
    const data = sessionStorage.getItem(DATABASE_KEY.userCoupon);
    return JSON.parse(data);
  }

  /**
   * DYNAMIC SESSION DATA
   */
  storeInputData(data: any, key: string) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getStoredInput(key: string): any {
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  }


  /**
   * LOCAL STORAGE
   */


  storeViewedProductData(data: RecommendedProductData) {
    if (data.productIds.length > 5 || data.subCategoryIds.length > 5) {
      data.productIds.splice(0, data.productIds.length - 5);
      data.subCategoryIds.splice(0, data.subCategoryIds.length - 5);
    }
    localStorage.setItem(DATABASE_KEY.recommendedProduct, JSON.stringify(data));
  }

  getViewedProductData() {
    const data = localStorage.getItem(DATABASE_KEY.recommendedProduct);
    return JSON.parse(data) as RecommendedProductData;
  }

  /**
   * COOKIE STORAGE
   */

  storeDataToCookieStorage(key: string, data: any, options?: object) {
    if (options) {
      this.cookieService.set(key, data, options);
    } else {
      this.cookieService.set(key, data);
    }
  }

  getDataFromCookieStorage(key: string): any {
    if (this.checkCookieData(key)) {
      return this.cookieService.get(key);
    } else {
      return null;
    }
  }
  getObjectDataFromCookie(key: string): any {
    if (this.checkCookieData(key)) {
      const data = this.cookieService.get(key);
      return JSON.parse(data);
    } else {
      return null;
    }
  }


  removeCookieData(key: string) {
    this.cookieService.delete(key);
  }

  removeAllCookieData() {
    this.cookieService.deleteAll();
  }

  checkCookieData(key: string): boolean {
    return this.cookieService.check(key);
  }


  /**
   * ENCRYPT STORAGE
   */
  addDataToEncryptLocal(data: any, key: string) {
    encryptStorage.setItem(key, data);
  }

  getDataFromEncryptLocal(key: string) {
    return encryptStorage.getItem(key);
  }

  removeDataFromEncryptLocal(key: string) {
    encryptStorage.removeItem(key);
  }

  removeAllDataFromEncryptLocal() {
    encryptStorage.clear();
  }

  /**
   * ENCRYPT STRING
   */
  encryptString(value: string) {
    return encryptStorage.encryptString(value);
  }

  decryptString(value: string) {
    return encryptStorage.decryptString(value);
  }


}
