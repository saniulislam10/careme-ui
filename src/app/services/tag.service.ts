import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Pagination} from "../interfaces/pagination";
import { Tag } from '../interfaces/tag';

const API_TAG = environment.apiBaseLink + '/api/tag/';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * addNewImageFolderData
   */

  addTag(data: Tag) {
    return this.http.post<{ message: string }>(API_TAG + 'add-new-tag', data);
  }

  getAllTags() {

    return this.http.get<{ data: Tag[],count: number}>(API_TAG + 'get-all-tags');
  }

  deleteTag(id) {
    return this.http.delete<{ message: string }>(API_TAG + 'delete-tag/'+ id);
  }
}
