import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
// import {city} from '../interfaces/city';
import{Thana}from'../interfaces/thana'

const API_THANA = environment.apiBaseLink + '/api/thana/';


@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class ThanaService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * district
   */
   addThana(data: Thana) {
    return this.httpClient.post<{message: string}>(API_THANA + 'add-thana', data);
  }

  getAllThana() {
    return this.httpClient.get<{data: Thana[], message?: string}>(API_THANA + 'get-all-thana');
  }

  getThanaByThanaId(id: string) {
    return this.httpClient.get<{data: Thana, message?: string}>(API_THANA + 'get-thana-by-thana-id/' + id);
  }

  getAllThanasByCityId(id: string) {
    return this.httpClient.get<{data: Thana[], message?: string}>(API_THANA + 'get-all-thanas-by-city-id/' + id);
  }

  editThanaData(data: Thana) {
    return this.httpClient.put<{message?: string}>(API_THANA + 'edit-thana-by-thana', data);
  }

  deleteThanaByThanaId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_THANA + 'delete-thana-by-id/' + id);
  }
}
