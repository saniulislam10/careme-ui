import {Cart} from './cart';
import {Order} from './order';
import {Wishlist} from './wishlist';

export interface User {
  zilla?:string;
  _id?: string;
  select?:boolean,
  fullName: string;
  username?: string;
  status?: number;
  gender?: string;
  birthdate?: Date;
  email?: string;
  phoneNo?: string;
  address?: string;
  profileImg?: string;
  password?: string;
  checkouts?: Order[];
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  registrationType?: string;
  registrationAt?: string;
  hasAccess?: boolean;
  occupation?: string;
  carts?: string | Cart[];
  wishlists?: string[] | Wishlist[];
  createdAt?: any;
  updatedAt?: any;
  shippingAddress?:string;
  points: number;
  redeemedPoints?: number;
  earnedPoints?: number;
  tag?: any;
  totalReturnAmount: number;
  totalReturn: number;
}
