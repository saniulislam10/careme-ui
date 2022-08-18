import { Injectable } from '@angular/core';
import {SizeChart} from "../interfaces/size-chart";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Pagination} from "../interfaces/pagination";
import { Product } from '../interfaces/product';

const API_CHART = environment.apiBaseLink + '/api/size-chart/';

@Injectable({
  providedIn: 'root'
})
export class SizeChartService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * addNewImageFolderData
   */

  addSizeChart(data: SizeChart) {
    return this.http.post<{ message: string }>(API_CHART + 'add-new-size-chart', data);
  }

  editSizeChart(data: SizeChart) {
    return this.http.put<{ message: string }>(API_CHART + 'edit-new-size-chart', data);
  }

  getAllSizeChart(paginate: Pagination, sort?: any, filter?: any, select?: string) {
    return this.http.post<{ data: SizeChart[],count: number}>(API_CHART + 'get-all-size-chart', {paginate, sort, filter, select});
  }

  getSizeChartByParentCategoryId(id) {
    return this.http.get<{ data: SizeChart[]}>(API_CHART + 'get-size-chart-by-parent-id/' + id);
  }
  getSizeChartByParentAndChildCategoryId(data) {
    return this.http.post<{ data: Product[]}>(API_CHART + 'get-products-by-category-and-sub-category-id', data);
  }
  deleteSizeChart(id) {
    return this.http.delete<{ message: string }>(API_CHART + 'delete-size-chart/'+ id);
  }
}
