import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product';
import { DiscountTypeEnum } from '../../enum/discount-type.enum';
import { AmountType } from 'src/app/enum/amount-type';

@Pipe({
  name: 'price',
})
export class PricePipe implements PipeTransform {
  transform(
    product: Product,
    type: string,
    quantity?: number,
    variantPrice?: number
  ): number {
    if (product) {
      switch (type) {
        case 'priceWithTax': {
          if (product.hasVariant === true) {
            if (product.hasTax) {
              if (quantity) {
                let price = Math.round(variantPrice* quantity + this.getTax(product.tax, variantPrice) * quantity);
                return price;
              } else {
                return 0;
              }
            } else {
              if (quantity) {
                return Math.round(variantPrice * quantity);
              } else {
                return 0;
              }
            }
          } else {
            if (product.hasTax) {
              if (quantity) {
                let price = Math.round(
                  (product?.sellingPrice* quantity + this.getTax(product.tax, product?.sellingPrice)* quantity)
                );
                return price;
              } else {
                return 0
              }
            } else {
              if (quantity) {
                return Math.round(product?.sellingPrice * quantity);
              } else {
                return 0;
              }
            }
          }
        }
        case 'priceWithoutTax': {
          if (product.hasVariant === true) {
            if (quantity) {
              return Math.round(variantPrice * quantity);
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(product?.sellingPrice * quantity);
            } else {
              return 0;
            }
          }
        }
        case 'totalTax': {
          if (quantity) {
            if(product?.hasTax){
              return Math.round(product?.tax * quantity);
            }else{
              return 0;
            }
            } else {
              return 0;
          }
        }
        case 'advance': {
          if(product.canPartialPayment){

            if (product.hasVariant === true) {
              if(product.partialPaymentType === AmountType.PERCENTAGE){
                if (product.tax !== 0) {
                  const tax = Math.round((product.tax / 100) * variantPrice);
                  if (quantity) {
                  return Math.round(
                    ((variantPrice + tax) *
                    quantity *
                    product.partialPayment) /
                    100
                    );
                  } else {
                    return 0;
                    }
                  } else {
                    if (quantity) {
                      return Math.round(variantPrice * quantity);
                    } else {
                      return 0;
                    }
                  }
                }else{
                  if (quantity) {
                    return Math.round(product.partialPayment * quantity);
                  }else{
                    return 0;
                  }
                }
              } else {
            if(product.partialPaymentType === AmountType.PERCENTAGE){
              if (product.tax !== 0) {
                if (quantity) {
                  let price = Math.round(((product.sellingPrice + product.tax) * quantity * product.partialPayment) /100)
                  return price;
                } else {
                  return 0;
                  }
                } else {
                  if (quantity) {
                    return Math.round(variantPrice * quantity);
                  } else {
                    return 0;
                  }
                }
              }else{
                if (quantity) {
                  return Math.round(product.partialPayment * quantity);
                }else{
                  return product.partialPayment;
                }
              }
            }
          }else{
            return 0;
          }
        }
        case 'discountPrice': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (quantity) {
              return (
                (product?.discountAmount / 100) *
                product?.sellingPrice *
                quantity
              );
            }
            return 0;
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (quantity) {
              return product?.discountAmount * quantity;
            }
            return 0;
          } else {
            return 0;
          }
        }
        case 'discountPercentage': {
          if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
            if (quantity) {
              return product?.discountAmount;
            }
            return product?.discountAmount;
          } else if (product.discountType === DiscountTypeEnum.CASH) {
            if (quantity) {
              return Math.round(
                (product?.discountAmount / product?.sellingPrice) * 100
              );
            }
            return 0;
          } else {
            return 0;
          }
        }
        case 'redeem': {
          if (product.hasVariant === true) {
            if (product.redeemPointsType === AmountType.AMOUNT) {
              if (quantity) {
                return Math.round(
                  (variantPrice - product?.redeemPoints) * quantity
                );
              } else {
                return 0;
              }
            } else if (product?.redeemPointsType === AmountType.PERCENTAGE) {
              if (quantity) {
                return Math.round(
                  (variantPrice -
                    (variantPrice * product?.redeemPoints) / 100) *
                    quantity
                );
              } else {
                return 0;
              }
            } else {
              return 0;
            }
          } else {
            if (product.redeemPointsType === AmountType.AMOUNT) {
              if (quantity) {
                return Math.round(
                  (product?.sellingPrice - product?.redeemPoints) * quantity
                );
              } else {
                return 0;
              }
            } else if (product?.redeemPointsType === AmountType.PERCENTAGE) {
              if (quantity) {
                return Math.round(
                  (product?.sellingPrice -
                    (product?.sellingPrice * product?.redeemPoints) / 100) *
                    quantity
                );
              } else {
                return 0;
              }
            } else {
              return 0;
            }
          }
        }
        case 'earn': {
          if (product.hasVariant === true) {
            if (quantity) {
              return Math.round(variantPrice * quantity);
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(product?.sellingPrice * quantity);
            } else {
              return 0;
            }
          }
        }
        case 'variant': {
          if (product.hasVariant === true) {
            if (quantity) {
              return Math.round(variantPrice * quantity);
            } else {
              return 0;
            }
          } else {
            if (quantity) {
              return Math.round(product?.sellingPrice * quantity);
            } else {
              return 0;
            }
          }
        }
        default: {
          return product?.sellingPrice;
        }
      }
    } else {
      return product?.sellingPrice;
    }
  }
  getTax(tax, price){
      return (price*tax)/100;
  }
}
