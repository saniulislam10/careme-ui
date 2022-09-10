import { ProductType } from 'src/app/interfaces/product-type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Pagination } from '../interfaces/pagination';

const API = environment.apiBaseLink + '/api/product-type/';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: ProductType) {
    return this.httpClient.post<{message?: string}>(API + 'add', data);
  }
  getAll(searchTerm?: string) {
    if(searchTerm){
      let params = new HttpParams();
      params = params.append('q', searchTerm);
      console.log(params);
      return this.httpClient.post<{data: ProductType[], message?: string}>(API + 'get-filtered-data', {params});
    }else{
      return this.httpClient.get<{data: ProductType[], message?: string}>(API + 'get-all');
    }
  }

  getSearchProductTypes(searchTerm?: string, pagination?: Pagination, filter?: any) {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: ProductType[] }>(API + 'get-filtered-data',{ filter },{ params });
  }

  getById(id: string) {
    return this.httpClient.get<{data: ProductType, message?: string}>(API + 'get-by-id/' + id);
  }

  editById(data: ProductType) {
    console.log(data);
    return this.httpClient.put<{message?: string}>(API + 'edit-by-id', data);
  }

  deleteById(id: string) {
    return this.httpClient.delete<{message?: string}>(API + 'delete-by-id/' + id);
  }
}
