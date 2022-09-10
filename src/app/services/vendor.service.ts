import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Pagination } from '../interfaces/pagination';
import { Product } from '../interfaces/product';
import { Vendor } from '../interfaces/vendor';


const API = environment.apiBaseLink + '/api/vendor/';


@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private httpClient: HttpClient
  ) { }


  getAll(searchTerm?: string) {
    if(searchTerm){
      let params = new HttpParams();
      params = params.append('q', searchTerm);
      console.log(params);
      return this.httpClient.post<{data: Vendor[], message?: string}>(API + 'get-filtered-data', {params});
    }else{
      return this.httpClient.get<{data: Vendor[], message?: string}>(API + 'get-all');
    }
  }

  getSearchVendors(searchTerm?: string, pagination?: Pagination, filter?: any) {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: Vendor[] }>(
      API + 'get-filtered-data',
      { filter },
      { params }
    );
  }

  getById(id: string) {
    return this.httpClient.get<{data: Vendor, message?: string}>(API + 'get-by-id/' + id);
  }

  editById(data: Vendor) {
    console.log(data);
    return this.httpClient.put<{message?: string}>(API + 'edit-by-id', data);
  }

  deleteById(id: string) {
    return this.httpClient.delete<{message?: string}>(API + 'delete-by-id/' + id);
  }
}
