import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Brand } from '../interfaces/brand';
import { Pagination } from '../interfaces/pagination';


const API = environment.apiBaseLink + '/api/brand/';


@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: Brand) {
    return this.httpClient.post<{message?: string}>(API + 'add', data);
  }
  getAll(searchTerm?: string) {
    if(searchTerm){
      let params = new HttpParams();
      params = params.append('q', searchTerm);
      console.log(params);
      return this.httpClient.post<{data: Brand[], message?: string}>(API + 'get-filtered-data', {params});
    }else{
      return this.httpClient.get<{data: Brand[], message?: string}>(API + 'get-all');
    }
  }

  getSearchBrands(searchTerm?: string, pagination?: Pagination, filter?: any) {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: Brand[] }>(API + 'get-filtered-data',{ filter },{ params });
  }

  getById(id: string) {
    return this.httpClient.get<{data: Brand, message?: string}>(API + 'get-by-id/' + id);
  }

  editById(data: Brand) {
    console.log(data);
    return this.httpClient.put<{message?: string}>(API + 'edit-by-id', data);
  }

  deleteById(id: string) {
    return this.httpClient.delete<{message?: string}>(API + 'delete-by-id/' + id);
  }
}
