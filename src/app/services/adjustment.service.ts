import { Adjustment } from './../interfaces/adjustment';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product';
import { Pagination } from '../interfaces/pagination';
import { ImageGallery } from '../interfaces/image-gallery';
import { ProductFilter } from '../interfaces/product-filter';
import { UiService } from './ui.service';

const API= environment.apiBaseLink + '/api/adjustment/';

@Injectable({
  providedIn: 'root',
})
export class AdjustmentService {
  constructor(
    private http: HttpClient,
    private uiService: UiService
  ) {}

  /**
   * PRODUCT
   */

  add(data: Adjustment) {
    return this.http.post<{ message: string }>(
      API + 'add',
      data
    );
  }
  edit(data: Adjustment) {
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
    return this.http.get<{ data: Adjustment, message: string }>(API + 'get/' +id);
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
