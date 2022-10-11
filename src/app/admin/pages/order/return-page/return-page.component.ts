import { Component, OnInit, ViewChild } from '@angular/core';
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
  listOfData: ReturnService[] = [];
  setOfCheckedId = new Set<number>();

  @ViewChild('createReturn') createReturn: CreateReturnComponent;
  returns: any[] = [];
  @ViewChild('searchForm') searchForm: NgForm;
  searchQuery: string;
  holdPrevData: Return[] = [];
  searchReturn: Return[] = [];
  isLoading: boolean;
  overlay: boolean;
  isOpen: boolean;
  constructor(
    private returnService: ReturnService
  ) { }

  ngOnInit(): void {
    this.getAllReturns();
  }

  getAllReturns(){
    this.returnService.getAllReturns()
    .subscribe(res => {
      this.returns = res.data;
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
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.overlay = false;
          this.searchReturn = [];
          this.searchQuery = null;
          this.getAllReturns();
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        return this.returnService.getSearchData(this.searchQuery, pagination);
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

}
