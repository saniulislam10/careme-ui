import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {Observable} from 'rxjs';
import { Category } from '../interfaces/category';
import { ProductFilter } from '../interfaces/product-filter';


const API_CATEGORY = environment.apiBaseLink + '/api/product-category/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: Category[] = [];

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CATEGORY
   */

  addCategory(data: Category) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-category', data);
  }

  insertManyCategory(data: Category[]) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-multiple-category', data);
  }

  getAllCategory() {
    return this.httpClient.get<{ data: Category[], message?: string, count: number }>(API_CATEGORY + 'get-all-categories');
  }


  getCategorysByDynamicSort(paginate: Pagination, sort: any, filter?: any) {
    return this.httpClient.post<{ data: Category[], message?: string, count: number }>(API_CATEGORY + 'get-categories-by-dynamic-sort', {paginate, sort, filter});
  }

  getCategoryByCategoryId(id: string) {
    return this.httpClient.get<{ data: Category, message?: string }>(API_CATEGORY + 'get-category-by-category-id/' + id);
  }

  editCategoryData(data: Category) {
    return this.httpClient.put<{ message: string }>(API_CATEGORY + 'edit-category-by-category', data);
  }

  getCategoriesBySearch(searchTerm: string, pagination?: Pagination, filter?: any) {

    let params = new HttpParams();
    params = params.append('q', searchTerm);
    // if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    // }
    return this.httpClient.post<{ data: Category[], count: number }>(API_CATEGORY + 'get-categories-by-search', {filter}, {params});
  }

  deleteCategory(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_CATEGORY + 'delete-category-by-id/' + id);
  }

  getCategoryByCategorySlug(slug: string) {
    return this.httpClient.get<{ data: Category, message?: string }>(API_CATEGORY + 'get-category-by-category-slug/' + slug);
  }

  getSearchCategories(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: Category[], count: number }>(API_CATEGORY + 'get-categories-by-search', paginate, {params});
  }


  /**
   * Get No Repeat Data
   */

  getAllCategoryNoRepeat(select?: string): Observable<{ data: Category[] }> {
    return new Observable((observer) => {
      if (this.categories.length > 0) {
        observer.next({data: this.categories});
        observer.complete();
      } else {
        let params = new HttpParams();
        if (select) {
          params = params.append('select', select);
        }
        this.httpClient.get<{ data: Category[] }>(API_CATEGORY + 'get-all-categories', {params})
          .subscribe((res) => {
            this.categories = res.data;
            observer.next({data: this.categories});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }
    });
  }


}
