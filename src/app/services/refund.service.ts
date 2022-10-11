import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Refund } from '../interfaces/refund';
import { Pagination } from '../interfaces/pagination';


const API = environment.apiBaseLink + '/api/refund/';


@Injectable({
  providedIn: 'root'
})
export class RefundService {

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: Refund) {
    console.log(data);
    return this.httpClient.post<{refundId?: string, message?: string}>(API + 'add', data);
  }
  getAll(searchTerm?: string) {
    if(searchTerm){
      let params = new HttpParams();
      params = params.append('q', searchTerm);
      console.log(params);
      return this.httpClient.post<{data: Refund[], message?: string}>(API + 'get-filtered-data', {params});
    }else{
      return this.httpClient.get<{data: Refund[], message?: string}>(API + 'get-all');
    }
  }

  getSearchBrands(searchTerm?: string, pagination?: Pagination, filter?: any) {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: Refund[] }>(API + 'get-filtered-data',{ filter },{ params });
  }

  getById(id: string) {
    return this.httpClient.get<{data: Refund, message?: string}>(API + 'get-by-id/' + id);
  }

  editById(data: Refund) {
    console.log(data);
    return this.httpClient.put<{message?: string}>(API + 'edit-by-id', data);
  }

  deleteById(id: string) {
    console.log(id);
    return this.httpClient.delete<{message?: string}>(API + 'delete-by-id/' + id);
  }
  getByReturnId(id: string) {
    console.log(id);
    return this.httpClient.get<{data: Refund, message?: string}>(API + 'get-by-returnId/' + id);
  }
}
