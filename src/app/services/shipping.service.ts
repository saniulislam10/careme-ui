import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { ShippingMethod } from '../interfaces/shipping-method';


const API_SHIPPING = environment.apiBaseLink + '/api/shipping/';


@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class ShippingService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * district
   */
   add(data: ShippingMethod) {
    return this.httpClient.post<{message: string}>(API_SHIPPING + 'add', data);
  }

  getAll() {
    return this.httpClient.get<{data: ShippingMethod[], message?: string}>(API_SHIPPING + 'get-all');
  }

  getById(id: string) {
    return this.httpClient.get<{data: ShippingMethod, message?: string}>(API_SHIPPING + 'get-by-id/' + id);
  }

  editData(data: ShippingMethod) {
    return this.httpClient.put<{message?: string}>(API_SHIPPING + 'edit', data);
  }

  deleteById(id: string) {
    return this.httpClient.delete<{message?: string}>(API_SHIPPING + 'delete-by-id/' + id);
  }
}
