import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { OrderStatus } from 'src/app/enum/order-status';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { Invoice } from 'src/app/interfaces/invoice';
import { Pagination } from 'src/app/interfaces/pagination';
import { Select } from 'src/app/interfaces/select';
import { InvoiceService } from 'src/app/services/invoice.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-all-invoice',
  templateUrl: './all-invoice.component.html',
  styleUrls: ['./all-invoice.component.scss'],
})
export class AllInvoiceComponent implements OnInit {
  private subAcRoute: Subscription;

  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  tabs = ['All Invoice', 'Overdue', 'Unpaid', 'Open', 'Closed', 'Paid'];
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
  ];
  checked = false;
  indeterminate = false;
  overlay = false;
  isOpen = false;
  listOfCurrentPageData: readonly Invoice[] = [];
  listOfData: readonly Invoice[] = [];
  loading = false;
  setOfCheckedId = new Set<string>();
  isFocused: any;

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.invoiceId, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly Invoice[]): void {
    this.listOfCurrentPageData = $event;
    this.currentPage = 2;
    // this.getAllInvoices();
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.invoiceId)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.invoiceId)
      ) && !this.checked;
  }

  invoices: Invoice[] = [];
  currentPage: number = 1;
  invoicePerPage = 10;
  totalNumbers = 0;
  //date
  today = new Date();
  dataFormDateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  filter: any;
  // sort
  public sortQuery = { createdAt: -1 };
  public query = null;
  public activeSort = null;

  //subscription
  searchInvoices: any[] = [];

  productOrderStatus: Select[] = [
    { value: OrderStatus.PENDING, viewValue: 'Pending' },
    { value: OrderStatus.CANCEL, viewValue: 'Cancel' },
    { value: OrderStatus.CONFIRM, viewValue: 'Confirm' },
    { value: OrderStatus.PROCESSING, viewValue: 'Processing' },
    { value: OrderStatus.SHIPPING, viewValue: 'Shipping' },
    { value: OrderStatus.DELIVERED, viewValue: 'Delivered' },
    { value: OrderStatus.RETURNING, viewValue: 'Returning' },
    { value: OrderStatus.REFUND, viewValue: 'Refund' },
  ];

  paymentOrderStatus: Select[] = [
    { value: PaymentStatus.PAID, viewValue: 'Paid' },
    { value: PaymentStatus.UNPAID, viewValue: 'Unpaid' },
    { value: PaymentStatus.PENDING, viewValue: 'Pending' },
    { value: PaymentStatus.PARTIALPAID, viewValue: 'Partial Paid' },
    { value: PaymentStatus.REFUNDED, viewValue: 'Refunded' },
    { value: PaymentStatus.OVERDUE, viewValue: 'Overdue' },
    { value: PaymentStatus.CANCEL, viewValue: 'Cancel' },
    { value: PaymentStatus.EXPIRED, viewValue: 'Expired' },
  ];

  constructor(
    private invoiceService: InvoiceService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam) => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.searchInvoices.length) {
        this.getAllInvoices();
      }
    });
    console.log(this.currentPage);
    this.getAllInvoices();
  }
  getAllInvoices() {
    this.loading = true;
    const pagination: Pagination = {
      pageSize: this.invoicePerPage.toString(),
      currentPage: this.currentPage.toString(),
    };
    this.invoiceService
      .getAllInvoices(pagination, this.sortQuery, this.filter)
      .subscribe(
        (res) => {
          this.invoices = res.data;
          this.totalNumbers = res.count;
          this.listOfData = this.invoices;
          this.loading = false;
        },
        (err) => {
          console.log(err);
          this.loading = false;
        }
      );
  }

  /**
   * SORTING
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllInvoices();
  }

  /**
   * FILTER DATA
   */

  filterByOrderStatus(data) {
    this.filter = { deliveryStatus: data };
    this.getAllInvoices();
  }

  filterByPaymentStatus(data: number) {
    this.filter = { paymentStatus: data };
    this.getAllInvoices();
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event.pageIndex } });
  }

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.start
      );
      const endDate = this.utilsService.getDateString(
        this.dataFormDateRange.value.end
      );
      const qData = { createdAt: { $gte: startDate, $lte: endDate } };
      this.filter = qData;

      if (this.currentPage > 1) {
        this.router.navigate([], { queryParams: { page: 1 } });
      } else {
        this.getAllInvoices();
      }
    }
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data.trim();
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchInvoices = [];
          this.query = null;
          this.getAllInvoices();
          return EMPTY;
        }
        this.loading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        return this.invoiceService.getInvoicesBySearch(this.query, pagination, this.filter);
      })
    )
      .subscribe(res => {
        this.loading = false;
        console.log(res.data);
        this.invoices = res.data;
        this.searchInvoices = res.data;
        if (this.searchInvoices.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.loading = false;
      });
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchInvoices.length > 0) {
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
    if (this.isOpen || this.isOpen && !this.loading) {
      return;
    }
    if (this.searchInvoices.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }
}
