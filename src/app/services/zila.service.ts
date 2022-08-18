import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import { Zila } from '../interfaces/zila';
// import {city} from '../interfaces/city';


const API_ZILA = environment.apiBaseLink + '/api/zila/';


@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class ZilaService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * district
   */
   addZila(data: Zila) {
    return this.httpClient.post<{message: string}>(API_ZILA + 'add-zila', data);
  }

  getAllZila() {
    return this.httpClient.get<{data: Zila[], message?: string}>(API_ZILA + 'get-all-zila');
  }

  getZilaByzilaId(id: string) {
    return this.httpClient.get<{data: Zila, message?: string}>(API_ZILA + 'get-zila-by-zila-id/' + id);
  }

  editZilaData(data: Zila) {
    return this.httpClient.put<{message?: string}>(API_ZILA + 'edit-zila-by-zila', data);
  }

  deleteZilaByZilaId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_ZILA + 'delete-zila-by-id/' + id);
  }
}
