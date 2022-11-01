import { City } from "./city";

export interface Zila {
  city?:string[] |City [];
  zilla: string;
  _id?: string;
  name: string;
  checked?: Boolean;
  label?: string;
  value?: string;

}
