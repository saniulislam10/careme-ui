import { Component, OnInit, ViewChild } from '@angular/core';
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

}
