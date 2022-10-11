import { Return } from './../interfaces/return';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';


const API_RETURN = environment.apiBaseLink + '/api/return/';

@Injectable({
  providedIn: 'root'
})
export class ReturnService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   * ORDER
   */
  placeReturn(data: Return) {
    return this.httpClient.post<{ _id: string; returnId: string; message: string; success: boolean }>(API_RETURN + 'place-return', data);
  }
  getAllReturnsByOrderNo(data: any) {
    return this.httpClient.post<{ data: Return[]; message: string; success: boolean }>(API_RETURN + 'get-all-returns-by-orderNo', {data});
  }
  getAllReturns() {
    return this.httpClient.get<{ data: Return[]; message: string; success: boolean }>(API_RETURN + 'get-all-returns');
  }
  getReturnById(id) {
    return this.httpClient.get<{ data: Return; message: string; success: boolean }>(API_RETURN + 'get-return-by-id/'+ id);
  }
  updateReturnById(id, data){
    return this.httpClient.put<{ message: string; success: boolean }>(API_RETURN + 'update-return-by-id/'+ id, data);
  }
  recieveReturnById(id, data){
    return this.httpClient.put<{ message: string; success: boolean }>(API_RETURN + 'recieve-return-by-id/'+ id, data);
  }

}
