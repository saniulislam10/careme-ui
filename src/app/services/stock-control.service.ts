import { Injectable } from '@angular/core';
import {SizeChart} from "../interfaces/size-chart";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Pagination} from "../interfaces/pagination";

const API_STOCK_CONTROL = environment.apiBaseLink + '/api/stock-control/';

@Injectable({
  providedIn: 'root'
})
export class StockControlService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * addNewImageFolderData
   */

  addStockControl(data: any) {
    return this.http.post<{ message: string }>(API_STOCK_CONTROL + 'add-new-stock-control', data);
  }

  getAllStockControl() {
    return this.http.get<{ data: any, message: string}>(API_STOCK_CONTROL + 'get-stock-control');
  }

  editStockControl(data: any) {
    return this.http.post<{ message: string }>(API_STOCK_CONTROL + 'update-stock-control', data);
  }

}
