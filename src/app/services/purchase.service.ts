import { OrderItem } from 'src/app/interfaces/order';
import { ConversionRate } from '../interfaces/conversion-rate';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product';
import { Pagination } from '../interfaces/pagination';
import { ImageGallery } from '../interfaces/image-gallery';
import { ProductFilter } from '../interfaces/product-filter';
import { UiService } from './ui.service';
import { Archived } from '../interfaces/archived';
import { Purchase } from '../interfaces/purchase';

const API= environment.apiBaseLink + '/api/purchase/';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  constructor(private http: HttpClient, private uiService: UiService) {}

  /**
   * PRODUCT
   */

  add(data: any) {
    return this.http.post<{ message: string }>(
      API + 'add',
      data
    );
  }
  edit(data: any) {
    return this.http.put<{ message: string }>(
      API + 'edit',
      data
    );
  }
  editRecieved(data: any) {
    return this.http.put<{ message: string }>(
      API + 'edit-recieved',
      data
    );
  }
  delete(id) {
    return this.http.delete<{ message: string }>(API + 'delete/'+id);
  }
  getById(id) {
    return this.http.get<{ data: Purchase, message: string }>(API + 'get/' +id);
  }
  getAll(paginate: Pagination, filter?: ProductFilter) {
    return this.http.post<{
      data: any[];
      priceRange: any;
      count: number;
      message: string;
    }>(API + 'get-all', { paginate, filter });
  }

}
