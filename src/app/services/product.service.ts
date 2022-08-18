import { OrderItem } from 'src/app/interfaces/order';
import { ConversionRate } from './../interfaces/conversion-rate';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Product } from '../interfaces/product';
import { Pagination } from '../interfaces/pagination';
import { ImageGallery } from '../interfaces/image-gallery';
import { ProductFilter } from '../interfaces/product-filter';
import { UiService } from './ui.service';
import { Archived } from '../interfaces/archived';

const API_PRODUCT = environment.apiBaseLink + '/api/product/';
const API_CONVERSION_RATE = environment.apiBaseLink + '/api/conversion-rate/';
const API_REQUEST_PRODUCT = environment.apiBaseLink + '/api/search/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private uiService: UiService) {}

  /**
   * PRODUCT
   */

  addSingleProduct(data: any) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'add-single-product',
      data
    );
  }

  insertManyProduct(data: any[]) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'add-multiple-products',
      data
    );
  }

  updateMultipleProductById(data: any[]) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'update-multiple-product-by-id',
      data
    );
  }

  updateProductQuantityById(data: OrderItem) {
    return this.http.post<{ message: string }>(
      API_PRODUCT + 'update-product-quantity-by-id',
      data
    );
  }

  getAllProducts(paginate: Pagination, filter?: ProductFilter) {
    return this.http.post<{
      data: Product[];
      priceRange: any;
      count: number;
      message: string;
    }>(API_PRODUCT + 'get-all-products', { paginate, filter });
  }
  getAllArchivedProducts(paginate: Pagination, filter?: ProductFilter) {
    return this.http.post<{
      data: Archived[];
      priceRange: any;
      count: number;
      message: string;
    }>(API_PRODUCT + 'get-all-archived-products', { paginate, filter });
  }
  // getAllArchivedProducts(paginate: Pagination, filter?: ProductFilter) {
  //   return this.http.get<{{data: Archived[], message?: string} }>(API_PRODUCT + 'get-all-products');
  // }
  // getAllArchivedProducts() {
  //   return this.http.get<{data: Archived[], message?: string}>(API_PRODUCT + 'get-all-archived-products');
  // }
  getSelectedProductDetails(selectedIds: string[]) {
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'get-selected-product-details',
      { selectedIds }
    );
  }

  getProductsByDynamicSort(
    paginate: Pagination,
    sort?: any,
    filter?: ProductFilter,
    select?: string
  ) {
    return this.http.post<{ data: Product[]; priceRange: any; count: number }>(
      API_PRODUCT + 'get-products-by-dynamic-sort',
      { paginate, sort, filter, select }
    );
  }
  getAddByLinkProductsByDynamicSort(
    paginate: Pagination,
    sort: any,
    filter?: ProductFilter,
    select?: string
  ) {
    return this.http.post<{ data: Product[]; priceRange: any; count: number }>(
      API_PRODUCT + 'get-add-by-link-products-by-dynamic-sort',
      { paginate, sort, filter, select }
    );
  }
  getSingleProductBySlug(slug: string) {
    return this.http.get<{ data: any; message: string }>(
      API_PRODUCT + 'get-single-product-by-slug/' + slug
    );
  }

  getSingleProductById(id: string) {
    return this.http.get<{ data: any; message: string }>(
      API_PRODUCT + 'get-single-product-by-id/' + id
    );
  }

  editProductById(data: any) {
    return this.http.put<{ message: string }>(
      API_PRODUCT + 'edit-product-by-id',
      data
    );
  }

  deleteProductById(id: string) {
    return this.http.delete<{ message: string }>(
      API_PRODUCT + 'delete-product-by-id/' + id
    );
  }


  getRelatedProducts(data: any) {
    return this.http.get<{ data: any; message: string }>(
      API_PRODUCT +
        'get-related-products/' +
        data.category +
        '/' +
        data.subCategory +
        '/' +
        data.id
    );
  }

  getRecommendedProducts(ids: any) {
    return this.http.post<{ data: any; message: string }>(
      API_PRODUCT + 'get-recommended-products/',
      { data: ids }
    );
  }

  productFilterByQuery(query: any, paginate?: any, select?: any) {
    const data = {
      query,
      paginate,
      select,
    };
    return this.http.post<{
      data: Product[];
      priceRange: any;
      count: number;
      message: string;
    }>(API_PRODUCT + 'product-filter-query', data);
  }

  getSearchProduct(searchTerm: string, pagination?: Pagination, filter?: any) {
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.http.post<{ data: Product[]; count: number }>(
      API_PRODUCT + 'get-products-by-search',
      { filter },
      { params }
    );
  }

  getSpecificProductsById(ids: string[], select?: string) {
    return this.http.post<{ data: Product[] }>(
      API_PRODUCT + 'get-specific-products-by-ids',
      { ids, select }
    );
  }
  getSpecificProductsByCategoryId(slugs: string, select?: string) {
    return this.http.post<{ data: Product[] }>(
      API_PRODUCT + 'get-specific-products-by-cat-id',
      { slugs, select }
    );
  }
  getSpecificProductsBySubCategoryId(slugs: string, select?: string) {
    return this.http.post<{ data: Product[] }>(
      API_PRODUCT + 'get-specific-products-by-sub-cat-id',
      { slugs, select }
    );
  }

  /**
   * Conversion Rate
   */

  addConversionRate(data: any) {
    return this.http.post<{ message: string }>(
      API_CONVERSION_RATE + 'add-conversion-rate',
      data
    );
  }

  editConversionRate(data: any) {
    return this.http.put<{ message: string }>(
      API_CONVERSION_RATE + 'edit-conversion-rate',
      data
    );
  }

  getAllConversionRate() {
    return this.http.get<{ data: ConversionRate[]; count: number }>(
      API_CONVERSION_RATE + 'get-all-conversion-rate'
    );
  }

  getSingleConversionRateById(id: string) {
    return this.http.get<{ data: any; message: string }>(
      API_CONVERSION_RATE + 'get-single-conversion-rate-by-id/' + id
    );
  }

  getSpecificConversionRateByUrl(url: String, select?: string) {
    return this.http.post<{ data: number }>(
      API_CONVERSION_RATE + 'get-specific-conversion-rate-by-url',
      { url, select }
    );
  }

  deleteConversionRateById(id: string) {
    return this.http.delete<{ message: string }>(
      API_CONVERSION_RATE + 'delete-conversion-rate/' + id
    );
  }
  /**
   * COMPARE LIST with LOCAL STORAGE
   */

  addToCompare(productId: string) {
    const items = JSON.parse(localStorage.getItem('compareList'));

    let compareList;

    if (items === null) {
      compareList = [];
      compareList.push(productId);
      this.uiService.success('Product added to compare list');
    } else {
      compareList = items;
      const fIndex = compareList.findIndex((o) => o._id === productId);
      if (fIndex === -1) {
        if (compareList.length !== 3) {
          compareList.push(productId);
          this.uiService.success('Product added to compare list');
        } else {
          this.uiService.wrong('Your compare list is full');
        }
      } else {
        this.uiService.warn('This product already in compare list');
      }
    }
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }

  getCompareList(): string[] {
    const list = localStorage.getItem('compareList');
    if (list === null) {
      return [];
    }
    return JSON.parse(list) as string[];
  }

  deleteCompareItem(id: string) {
    const items = JSON.parse(localStorage.getItem('compareList'));
    const filtered = items.filter((el) => el !== id);
    localStorage.setItem('compareList', JSON.stringify(filtered));
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias) {
      for (let i = 0, x = 0; i < medias.length; i++) {
        if (medias[i] !== null && medias[i] !== '') {
          allMedias.push(medias[i]);
          x++;
        }
      }

      if (images) {
        allMedias = [...allMedias, ...images];
      }
    } else {
      allMedias = images;
    }
    return allMedias;
  }


  /**
   * Request Product
   */
  getAliexpressProductInfo(id){
    return this.http.get<{ data: any, message: string }>(
      API_REQUEST_PRODUCT + 'get-aliexpress-product-data/' + id
    );
  }
  getAmazonProductInfo(id){
    console.log(id);

    return this.http.get<{ data: any, message: string }>(
      API_REQUEST_PRODUCT + 'get-amazon-product-data/' + id
    );
  }
  getAmazonIndiaProductInfo(id){
    console.log(id);

    return this.http.get<{ data: any, message: string }>(
      API_REQUEST_PRODUCT + 'get-amazon-india-product-data/' + id
    );
  }
  getWalmartProductInfo(id){
    return this.http.get<{ data: any, message: string }>(
      API_REQUEST_PRODUCT + 'get-walmart-product-data/' + id
    );
  }

}
