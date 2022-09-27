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
  getAllInvoicesByOrderNo(data: any) {
    return this.httpClient.post<{ data: any; message: string; success: boolean }>(API_INVOICE + 'get-all-invoices-by-orderNo', {data});
  }
  getAllInvoices(paginate?: Pagination, sort?: any, filter?: any, select?: string) {
    return this.httpClient.post<{ data: Invoice[]; count: number }>(API_INVOICE + 'get-all-invoices', {paginate, sort, filter, select});
  }
  getInvoiceById(id) {
    return this.httpClient.get<{ data: any; message: string; success: boolean }>(API_INVOICE + 'get-invoice-by-id/'+ id);
  }

}
