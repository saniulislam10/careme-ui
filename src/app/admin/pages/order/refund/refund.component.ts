import { NzMessageService } from 'ng-zorro-antd/message';
import { Refund } from './../../../../interfaces/refund';
import { RefundService } from './../../../../services/refund.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY } from 'rxjs';
import {
  pluck,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { Pagination } from 'src/app/interfaces/pagination';

interface ItemData {
  id: number;
  name: string;
  initiatedby: string;
  returnid: string;
}

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.scss'],
})
export class RefundComponent implements OnInit {
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;

  tabs = ['All Invoice', 'Closed', 'Pending'];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  refunds: Refund[] = [];
  setOfCheckedId = new Set<number>();

  // Create Refund Modal
  isVisible = false;
  loading = false;
  searchQuery: string;
  overlay: boolean;
  searchRefund: Refund[] = [];
  isLoading: boolean;
  currentPage = 1;
  refundPerPage = 10;
  isOpen: boolean;
  isFocused: any;
  sortQuery: any;

  constructor(
    private refundService: RefundService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getAllRefund();
  }

  getAllRefund() {
    this.loading = true;
    this.refundService.getAll().subscribe(
      (res) => {
        this.refunds = res.data;
        this.loading = false;
      },
      (err) => {
        this.msg.create('error', err.message, {
          nzDuration: 5000,
        });
      }
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    formValue
      .pipe(
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          this.searchQuery = data.trim();
          console.log('Searching 1', this.searchQuery);
          if (this.searchQuery === '' || this.searchQuery === null) {
            console.log('Searching 2', this.searchQuery);
            this.overlay = false;
            this.searchRefund = [];
            this.searchQuery = null;
            this.getAllRefund();
            return EMPTY;
          }
          console.log('Searching 3', this.searchQuery);
          this.isLoading = true;
          const pagination: Pagination = {
            currentPage: this.currentPage.toString(),
            pageSize: this.refundPerPage.toString(),
          };
          return this.refundService.getSearchData(
            this.searchQuery,
            pagination,
            this.sortQuery
          );
        })
      )
      .subscribe(
        (res) => {
          console.log(res.data);
          this.isLoading = false;
          this.refunds = res.data;
          this.searchRefund = res.data;
          if (this.searchRefund.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchRefund.length > 0) {
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
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchRefund.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  sortData(query: any, type: any) {
    this.sortQuery = query;
    if (this.searchQuery) {
      const pagination: Pagination = {
        currentPage: '1',
        pageSize: '10',
      };
      this.refundService
        .getSearchData(this.searchQuery, pagination, this.sortQuery)
        .subscribe(
          (res) => {
            this.isLoading = false;
            this.refunds = res.data;
            this.searchRefund = res.data;
            if (this.searchRefund.length > 0) {
              this.isOpen = true;
              this.overlay = true;
            }
          },
          (err) => {
            this.isLoading = false;
          }
        );
    } else {
      this.getAllRefund();
    }
  }
}
