

import {Zila} from './zila';

export interface City {
  city?:string;
  _id?: string;
  area: string;
  areabn?: string;
  coordinates?: string;
  district?: string | Zila;
}

