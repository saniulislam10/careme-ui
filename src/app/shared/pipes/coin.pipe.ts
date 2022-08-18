import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '../../interfaces/product';
import { AmountType } from 'src/app/enum/amount-type';

@Pipe({
  name: 'coin'
})
export class CoinPipe implements PipeTransform {

  transform(product: Product, type: string, quantity?: number, variantPrice?:number): number {

    if (product) {
      switch (type) {
        case 'redeem': {
          if(product.hasVariant === true){
            if (product.redeemPointsType === AmountType.AMOUNT) {
              if(quantity){
                return Math.round((product?.redeemPoints) * quantity);
              }else{
                return Math.round(product?.redeemPoints);
              }
            } else if (product?.redeemPointsType === AmountType.PERCENTAGE) {
              if(quantity){
                return Math.round((variantPrice * product?.redeemPoints / 100) * quantity);
              }else{
                return Math.round(variantPrice * product?.redeemPoints / 100);
              }
            } else {
              return 0;
            }
          }else{
            if (product.redeemPointsType === AmountType.AMOUNT) {
              if(quantity){
                return Math.round((product?.redeemPoints) * quantity);
              }else{
                return Math.round(product?.redeemPoints);
              }
            } else if (product?.redeemPointsType === AmountType.PERCENTAGE) {
              if(quantity){
                return Math.round((product?.sellingPrice * product?.redeemPoints / 100) * quantity);
              }else{
                return Math.round(product?.sellingPrice * product?.redeemPoints / 100);
              }
            } else {
              return 0;
            }
          }
        }
        case 'earn': {
          if(product.hasVariant === true){
            if (product.earnPointsType === AmountType.AMOUNT) {
              if(quantity){
                return Math.round(product?.earnPoints * quantity);
              }else{
                return Math.round(product?.earnPoints);
              }
            } else if (product?.earnPointsType === AmountType.PERCENTAGE) {
              if(quantity){
                return Math.round((variantPrice * product?.earnPoints / 100) * quantity);
              }else{
                return Math.round(variantPrice * product?.earnPoints / 100);
              }
            } else {
              return 0;
            }
          }else{
            if (product.earnPointsType === AmountType.AMOUNT) {
              if(quantity){
                return Math.round(product?.earnPoints * quantity);
              }else{
                return Math.round(product?.earnPoints);
              }
            } else if (product?.earnPointsType === AmountType.PERCENTAGE) {
              if(quantity){
                return Math.round((product?.sellingPrice * product?.earnPoints / 100) * quantity);
              }else{
                return Math.round(product?.sellingPrice * product?.earnPoints / 100);
              }
            } else {
              return 0;
            }
          }
        }
        default: {
          return 0;
        }
      }
    } else {
      return 0;
    }

  }

}
