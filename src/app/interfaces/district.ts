import {Area} from './area';

export interface District {
  _id?: string;
  district: string;
  districtbn?: string;
  coordinates?: string;
  areas?: string[] | Area[];
}
