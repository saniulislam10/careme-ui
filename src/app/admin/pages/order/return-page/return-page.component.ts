import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Pagination } from 'src/app/interfaces/pagination';
import { Return } from 'src/app/interfaces/return';
import { ReturnService } from 'src/app/services/return.service';
import { CreateReturnComponent } from 'src/app/shared/components/create-return/create-return.component';
interface ItemData {
  id: number;
  name: string;
  initiatedby: string;
  returnid: string;
}

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.scss']
})
export class ReturnPageComponent implements OnInit {
  tabs = ['All Return', 'Returning', 'Recived'];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

  @ViewChild('createReturn') createReturn: CreateReturnComponent;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  returns: Return[] = [];
  searchQuery: string;
  public sortQuery = { createdAt: -1 };
  holdPrevData: Return[] = [];
  searchReturn: Return[] = [];
  isLoading: boolean;
  overlay: boolean;
  isOpen: boolean;
  isFocused: boolean;
  returnsPerPage = 50;
  currentPage = 1;
  totalNumbers = 0;
  constructor(
    private returnService: ReturnService
  ) { }

  ngOnInit(): void {
    this.getAllReturns();
  }

  getAllReturns(){

    this.isLoading = true;

    const pagination: Pagination = {
      pageSize: this.returnsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.returnService.getAllReturns(pagination, this.sortQuery)
    .subscribe(res => {
      this.returns = res.data;
      this.isLoading = false;
    }, err=>{
      console.log(err);
    })
  }

  createReturnPopUp(){
    this.createReturn.createReturnShow();
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

    formValue.pipe(
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data.trim();
        console.log(this.searchQuery)
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.overlay = false;
          this.searchReturn = [];
          this.searchQuery = null;
          this.getAllReturns();
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: this.currentPage.toString(),
          pageSize: this.returnsPerPage.toString()
        };
        return this.returnService.getSearchData(this.searchQuery, pagination, this.sortQuery);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        console.log(res.data);
        this.returns = res.data;
        this.searchReturn = res.data;
        if (this.searchReturn.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.isLoading = false;
      });
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchReturn.length > 0) {
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
    if (this.searchReturn.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  sortData(query: any, type: any) {
    this.sortQuery = query;
    if(this.searchQuery){
      const pagination: Pagination = {
        currentPage: '1',
        pageSize: '10'
      };
      this.returnService.getSearchData(this.searchQuery, pagination, this.sortQuery)
      .subscribe(res => {
        this.isLoading = false;
        this.returns = res.data;
        this.searchReturn = res.data;
        if (this.searchReturn.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, err=>{
        this.isLoading = false;
      })
    }else{
      this.getAllReturns();
    }
  }

}
