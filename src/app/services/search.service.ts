import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Query } from '@angular/core';
import { query } from 'express';
import { environment } from 'src/environments/environment';
import { ProductBySearch } from '../interfaces/product-by-search';
import { timeout } from 'rxjs/operators';
import { Product } from '../interfaces/product';


const API_SEARCH = environment.apiBaseLink + '/api/search/';
const API_SEARCH_ALI = environment.apiBaseLinkAli + '/api/search/';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  product: any;
  productType: string;
  link: String;

  constructor(private httpClient: HttpClient) {}

  getProductFromAliexpress(link) {
    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH_ALI + 'get-product-from-aliexpress',
        { link },
      )
  }
  getProductFromAmazon(link) {
    return this.httpClient
      .post<{ data: ProductBySearch; success?: string }>(
        API_SEARCH + 'get-product-from-amazon',
        { link }
      )
      .pipe(timeout(3600000));


  }

  getProductFromAmazonManual(link) {
    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH + 'get-product-from-amazon-manual',
        { link }
      )
      .pipe(timeout(3600000000000));
  }


  // FlipKart Menual Scraping
  getProductFromFlipKart(link: string) {

    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH + 'get-product-from-flipkart',
        { link }
      )
      .pipe(timeout(3600000));
  }

  // Myntra Menual Scraping
  getProductFromMyntra(link: string) {
    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH + 'get-product-from-myntra',
        { link }
      )
      .pipe(timeout(3600000));
  }

  // Ebay Menual Scraping
  getProductFromEbay(link: string) {
    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH + 'get-product-from-ebay',
        { link }
      )
      .pipe(timeout(3600000));
  }

  getProductFromWalmart(link: string) {
    return this.httpClient
      .post<{ data: any; success?: string }>(
        API_SEARCH + 'get-product-from-walmart',
        { link }
      )
      .pipe(timeout(360000000));
  }

  public postOrder(data: ProductBySearch) {
    return this.httpClient.post<{ data: string; message?: string }>(
      API_SEARCH + 'post-order',
      data
    );
  }
  public getAllOrders() {
    return this.httpClient.get<{ data: ProductBySearch; message?: string }>(
      API_SEARCH + 'get-all-orders'
    );
  }
  public getOrderById(id) {
    return this.httpClient.get<{ data: ProductBySearch; message?: string }>(
      API_SEARCH + 'get-order-by-id/' + id
    );
  }

  public getSearchProduct() {
    return this.product;
  }

  public setSearchProduct(product: ProductBySearch) {
    this.product = product;
  }

  public getSearchLink() {
    return this.link;
  }
  public setSearchLink(link: String) {
    this.link = link;
  }

  public getProductType() {
    return this.productType;
  }

  public setProductType(type: string) {
    this.productType = type;
  }
}
