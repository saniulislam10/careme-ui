import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {ProductAttribute} from '../interfaces/product-attribute';
import { SubCategory } from '../interfaces/sub-category';

const API_SUB_CATEGORY = environment.apiBaseLink + '/api/product-sub-category/';

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * SUB-CATEGORY
   */

  addSubCategory(data: SubCategory) {
    return this.httpClient.post<{message: string}>(API_SUB_CATEGORY + 'add-sub-category', data);
  }

  insertManySubCategory(data: SubCategory[]) {
    return this.httpClient.post<{ message: string }>(API_SUB_CATEGORY + 'add-multiple-sub-category', data);
  }

  getAllSubCategory(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: SubCategory[], message?: string, count: number }>(API_SUB_CATEGORY + 'get-all-sub-categories', {params});
    } else {
      return this.httpClient.get<{ data: SubCategory[], message?: string, count: number }>(API_SUB_CATEGORY + 'get-all-sub-categories');
    }

  }


  getSubCategoryByCategoryId(id: string) {
    return this.httpClient.get<{data: SubCategory[], message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-category-id/' + id);
  }

  editSubCategoryData(data: SubCategory) {
    return this.httpClient.put<{message: string}>(API_SUB_CATEGORY + 'edit-sub-category-by-sub-category', data);
  }


  getSubCategoryBySubCategoryId(id: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<{data: SubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-sub-category-id/' + id);
  }
  getSubCategoryBySearch(id: string) {
    return this.httpClient.get<{data: SubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-search/' + id);
  }

  deleteSubCategory(id: string) {
    return this.httpClient.delete<{message?: string}>(API_SUB_CATEGORY + 'delete-sub-category-by-id/' + id);
  }

  getSubCategoryBySubCategorySlug(slug: string) {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<{data: SubCategory, message?: string}>(API_SUB_CATEGORY + 'get-sub-category-by-sub-category-slug/' + slug);
  }

  getSearchSubCategory(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: SubCategory[], count: number }>(API_SUB_CATEGORY + 'get-sub-categories-by-search', paginate, {params});
  }

  getSubCategorysByDynamicSort(paginate: Pagination, sort: any, filter?: any) {
    return this.httpClient.post<{ data: SubCategory[], message?: string, count: number }>(API_SUB_CATEGORY + 'get-sub-categories-by-dynamic-sort', {paginate, sort, filter});
  }


}
