import { Invoice } from './../interfaces/invoice';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Pagination } from '../interfaces/pagination';


const API_INVOICE = environment.apiBaseLink + '/api/invoice/';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   * ORDER
   */
  placeInvoice(data: any) {
    return this.httpClient.post<{ _id: string; invoiceId: any; message: string; success: boolean }>(API_INVOICE + 'place-invoice', data);
  }
  getAllInvoicesByOrderNo(id: any) {
    return this.httpClient.get<{ data: Invoice[]; message: string; success: boolean }>(API_INVOICE + 'get-all-invoices-by-orderNo/' + id);
  }
  getAllInvoices(paginate?: Pagination, sort?: any, filter?: any, select?: string) {
    return this.httpClient.post<{ data: Invoice[]; count: number }>(API_INVOICE + 'get-all-invoices', {paginate, sort, filter, select});
  }
  getInvoiceById(id) {
    return this.httpClient.get<{ data: any; message: string; success: boolean }>(API_INVOICE + 'get-invoice-by-id/'+ id);
  }

  getInvoicesBySearch(searchTerm: string, pagination?: Pagination, filter?: any) {

    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: Invoice[], count: number }>(API_INVOICE + 'get-invoices-by-search', { filter }, { params });
  }

  updateInvoiceById(data: Invoice){
    console.log(data);
    return this.httpClient.post<{ message: string; success: boolean }>(API_INVOICE + 'update-invoice-by-id', data);
  }

}
