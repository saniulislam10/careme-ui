import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
// import {city} from '../interfaces/city';
import{City}from'../interfaces/city'

const API_CITY = environment.apiBaseLink + '/api/city/';


@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class CityService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * district
   */
   addCity(data: City) {
    return this.httpClient.post<{message: string}>(API_CITY + 'add-city', data);
  }

  getAllCity() {
    return this.httpClient.get<{data: City[], message?: string}>(API_CITY + 'get-all-city');
  }

  getCityByCitytId(id: string) {
    return this.httpClient.get<{data: City, message?: string}>(API_CITY + 'get-city-by-city-id/' + id);
  }
  getAllCityByZilaId(zilaId: string) {
    return this.httpClient.get<{data: City[], message?: string}>(API_CITY + 'get-city-by-zila-id/' + zilaId);
  }


  editCityData(data: City) {
    return this.httpClient.put<{message?: string}>(API_CITY + 'edit-city-by-city', data);
  }

  deleteCityByCityId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_CITY + 'delete-city-by-id/' + id);
  }
}
