import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { ExportType } from 'src/app/enum/exportType.enum';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AdminDataService } from 'src/app/services/admin-data.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as XLSX from 'xlsx';
import { ExportPopupComponent } from './export-popup/export-popup.component';
// import { ExportPopupComponent } from '../../order/regular-orders/export-popup/export-popup.component';

@Component({
  selector: 'app-all-customers',
  templateUrl: './all-customers.component.html',
  styleUrls: ['./all-customers.component.scss']
})
export class AllCustomersComponent implements OnInit {

  @ViewChild('searchForm') searchForm: NgForm;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('export') exportOrder:ExportPopupComponent;
  customers: User[] = [];
  searchProducts: Product[] = [];
  // Subscription
  private subCustomer: Subscription;
  private subAcRoute: Subscription;

  filter: any[] = [];

  // Store Data
  users: User[] = [];
  private holdPrevData: any;

  // Filter Date Range
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // Pagination
  productsPerPage = 20;
  currentPage = 1;
  totalUsers = 0;

  // sort
  public sortQuery = {createdAt: -1};
  public activeSort = null;

  // SEARCH AREA
  searchUsers: User[] = [];

// Selected Data
selectedIds: string[] = [];
@ViewChild('matCheckbox') matCheckbox: MatCheckbox;
  constructor(
    private adminDataService: AdminDataService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private router: Router,
    private utilsService: UtilsService,
    private userService:UserService,
    private userDataService:UserDataService,
  ) { }

  ngOnInit(): void {

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.searchUsers.length) {
        this.getAllUsers();
      }
    });

    // OBSERVABLE
    this.reloadService.refreshProduct$
    .subscribe(() => {
        this.getAllUsers();
      });
  }

  /**
   * SORTING
   */
   sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllUsers();
  }

  /**
   * PAGINATION CHANGE
   */
   public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * Http Req
   */

  getAllUsers(){
    this.spinner.show();

    // Filter
     const mQuery = this.filter.length > 0 ? {$and: this.filter} : null;

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.subCustomer = this.adminDataService.getAllCustomers(pagination, this.sortQuery, mQuery)
    .subscribe(res => {
      this.customers = res.data;
      if (this.customers && this.customers.length) {
        this.customers.forEach((m, i) => {
          const index = this.selectedIds.findIndex(f => f === m._id);
          this.customers[i].select = index !== -1;
        });
        this.checkSelectionData();
        this.holdPrevData = res.data;
        // this.totalOrders = res.count;
        // this.totalOrdersStore = res.count;

      this.holdPrevData = res.data;
      this.totalUsers = res.count;}
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  private getFilteredUser(){
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    const fData=this.filter[0];
    this.adminDataService.getAllCustomers(pagination,{},this.filter[0])
    .subscribe((res)=>{
      this.customers=res.data;
    }, (err) => {
      console.log(err);
    })
  }

  /**
   * FILTER DATA With Date Range
   */


   endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(this.dataFormDateRange.value.start);
      const endDate = this.utilsService.getDateString(this.dataFormDateRange.value.end);
      const qData = {createdAt: {$gte: startDate, $lte: endDate}};
      const index = this.filter.findIndex(x => x.hasOwnProperty('dateString'));
      // let index = 0;
      if (index < 0) {
        // this.filter.push(qData);
        this.filter[0] = qData;
      } else {
        this.filter[0] = qData;
        // this.filter[0] = {registrationAt: {$gte: startDate, $lte: endDate}}
      }

      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getFilteredUser();
      }
    }
  }

 /**
   * ON Select Check
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex(f => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.customers.map(m => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds)
      this.customers.forEach(m => {
        m.select = true;
      })
    } else {
      currentPageIds.forEach(m => {
        this.customers.find(f => f._id === m).select = false;
        const i = this.selectedIds.findIndex(f => f === m);
        this.selectedIds.splice(i, 1);
      })
    }
  }

  private checkSelectionData() {
    let isAllSelect = true;
    this.customers.forEach(m => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }

  ngAfterViewInit(): void {
    // this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data.trim();
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchUsers = [];
          this.query = null;
          this.getAllUsers();
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        const filter = {productVisibility: true};
        console.log(data);
        return this.userDataService.getSearchUsers(data, pagination, filter);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.customers = res.data;
        this.searchUsers=res.data;
        if (this.searchUsers.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.isLoading = false;
      });
  }

  /**
   * HANDLE SEARCH
   * OVERLAY
   * SELECT
   */


  onClickHeader(): void {
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }


  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }


  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }


  handleOpen(): void {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchUsers = [];
    this.isFocused = false;
  }


  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    // this.router.navigate(['/product-details', data?.productSlug]);
    // this.router.navigate(['/', data?.brandSlug, data?.categorySlug, data?.productSlug]);
  }

  /**
   * Calculation
   */

   totalSpent(index){
     let total =0;
     for(let i=0; i<this.customers[index].checkouts.length; i++){
       total += this.customers[index].checkouts[i].totalAmount;
     }
     return total;
   }
 /**** export pop up */
 exportPopUpShow(){
  this.exportOrder.exportPOpUpShow();
}
   /**
   * EXPORTS TO EXCEL
   */
    exportToExcel(value){

      if(value.selectedAmount===ExportType.ALL_ORDERS){
        this.adminDataService.getAllCustomers(null)
        .subscribe(res=>{
          this.exportData(res.data,value.SelectedType)
        }, err=>{
          console.log(err);
        })
        // exportToExcel(this.orders)
      }
      else if(value.selectedAmount === ExportType.CURRENT_PAGE){
        this.exportData(this.customers,value.SelectedType)
      }
      else if(value.selectedAmount === ExportType.SELECTED){
        this.adminDataService.getSelectedUserDetails(this.selectedIds)
        .subscribe(res=>{
          this.exportData(res.data,value.SelectedType)
        }, err=>{
          console.log(err);
        })
      }
      else if(value.selectedAmount === ExportType.BY_SEARCH_RESULT){
          this.exportData(this.customers,value.SelectedType);
      }
      else if(value.selectedAmount === ExportType.BY_DATE){

      }
    }
    exportData(orders,type){
      this.spinner.show();
      const date = this.utilsService.getDateString(new Date());
      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orders);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'customers');
      if(type==="2"){
      XLSX.writeFile(wb, `Customers${date}.csv`);
      }
      else{
        XLSX.writeFile(wb, `Customers${date}.xlsx`);
      }
      this.spinner.hide();
    }



}
