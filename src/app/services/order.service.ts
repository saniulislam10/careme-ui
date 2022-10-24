import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
// import {SslInit} from '../interfaces/ssl-init';
import { Order } from '../interfaces/order';
import { Product } from '../interfaces/product';
import { Pagination } from '../interfaces/pagination';
import { ProductFilter } from '../interfaces/product-filter';
// import {OrderFilter} from '../admin/pages/orders/orders.component';


const API_ORDER = environment.apiBaseLink + '/api/order/';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient
  ) { }


  /**
   * ORDER
   */
  editOrder(data: Order) {
    return this.httpClient.post<{ _id: string; orderId: any; message: string; success: boolean }>(API_ORDER + 'edit-order', data);
  }
  placeOrder(data: Order) {
    return this.httpClient.post<{ _id: string; orderId: any; message: string; success: boolean }>(API_ORDER + 'place-order', data);
  }
  updateOrder(data: any) {
    return this.httpClient.post<{ _id: string; orderId: any; message: string; success: boolean }>(API_ORDER + 'update-order', data);
  }
  placeOrderRequest(data: Order) {
    return this.httpClient.post<{ _id: string; orderId: any; message: string; success: boolean }>(API_ORDER + 'place-order-request', data);
  }

  placeTempOrder(data: any) {
    return this.httpClient.post<{ _id: string; orderId: any; message: string; success: boolean }>(API_ORDER + 'place-temp-order', data);
  }

  updateOrderSessionKey(tranId: string, sessionkey: string) {
    return this.httpClient.post<{ message: string }>(API_ORDER + 'update-session-key/' + tranId + '/' + sessionkey, {});
  }

  getAllOrdersByUser(pagination?: Pagination, select?: string, id?: string) {
    return this.httpClient.get<{ data: Order[], count: number, message?: string }>(API_ORDER + 'get-all-orders-by-user');
  }

  getAllOrdersByUserOrderId(id: string, select?: string,) {
    let params = new HttpParams();

    if (id) {
      console.log("param id ", id)

      params = params.append('id', id)
    }

    if (select) {
      params = params.append('select', select);
    }

    return this.httpClient.get<{ data: Order[], count: number, message?: string }>
      (API_ORDER + 'get-orders-by-user-orderId', { params });
  }



  getAllOrdersofyUserByAdmin(pagination?: Pagination, select?: string, userId?: string) {
    let params = new HttpParams();

    if (userId) {
      params = params.append('userId', userId)
    }
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-orders-of-user-by-admin', { params });
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-orders-of-user-by-admin', { params });
    }
  }


  getOrderDetails(orderId: string) {
    return this.httpClient.get<{ data: Order, message?: string }>(API_ORDER + 'get-order-details/' + orderId);
  }

  getrequestOrderDetails(orderId: string) {
    return this.httpClient.get<{ data: Order, message?: string }>(API_ORDER + 'get-request-order-details/' + orderId);
  }

  cancelOrderByUser(orderId: string) {
    return this.httpClient.put<{ message: string, status: number }>(API_ORDER + 'cancel-order-by-user/' + orderId, {});
  }

  deleteOrderByAdmin(orderId: string) {
    return this.httpClient.delete<{ message?: string }>(API_ORDER + 'delete-order-by-admin/' + orderId);
  }


  getAllTransactionByUser(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-transactions-by-user', { params });
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-transactions-by-user', { params });
    }
  }


  /**
   * ADMIN ACCESS
   */
  // getAllOrdersByAdmin(paginate: Pagination, select?: string, filter?: OrderFilter) {
  //   return this.httpClient.post<{ data: Order[],  count: number, message: string }>(API_ORDER + 'get-all-products', {paginate, filter});
  // }


  getAllOrdersByAdmin(paginate?: Pagination, sort?: any, filter?: any, select?: string,) {
    return this.httpClient.post<{ data: Order[], priceRange: any, count: number }>(API_ORDER + 'get-all-orders-by-admin', { paginate, sort, filter, select });
  }

  getOrdersBySearch(searchTerm: string, pagination?: Pagination, filter?: any) {

    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.httpClient.post<{ data: Order[], count: number }>(API_ORDER + 'get-order-by-search', { filter }, { params });
  }
  getSelectedOrderDetails(selectedIds: string[]) {
    return this.httpClient.post<{ data: Order[], count: number }>(API_ORDER + 'get-selected-order-details', { selectedIds });
  }

  getAllOrdersByAdminNoPaginate() {
    return this.httpClient.get<{ data: Order[] }>(API_ORDER + 'get-all-orders-by-admin-no-paginate');
  }

  changeOrderStatus(data: any) {
    return this.httpClient.put<{ message: string }>(API_ORDER + 'change-order-status', data);
  }

  // router.get('/get-all-transaction-by-admin', checkAdminAuth, controller.getAllTransactionByAdmin);

  getAllTransactionByAdmin(pagination?: Pagination, select?: string) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-transaction-by-admin', { params });
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.httpClient.get<{ data: Order[], count: number, message?: string }>
        (API_ORDER + 'get-all-transaction-by-admin', { params });
    }
  }

  testSslSmsApi() {
    return this.httpClient.get<any>(API_ORDER + 'sent-test-ssl-message');
  }

  updateOrderById(data) {
    return this.httpClient.put<{ message: string }>(API_ORDER + 'update-order-by-id', data);
  }

  updateRequestOrderById(data) {
    return this.httpClient.put<{ message: string }>(API_ORDER + 'update-request-order-by-id', data);
  }

  // router.get('/sent-test-ssl-message', controller.testSslSmsApi);

  payPayment(data){
    return this.httpClient.post<{message: string, success: boolean}>(API_ORDER + 'pay-payment', data);
  }

}
