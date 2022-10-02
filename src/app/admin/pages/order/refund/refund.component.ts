import {NzMessageService} from 'ng-zorro-antd/message';
import {Refund} from './../../../../interfaces/refund';
import {RefundService} from './../../../../services/refund.service';
import {Component, OnInit} from '@angular/core';

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
  tabs = ['All Invoice', 'Closed', 'Pending'];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: Refund[] = [];
  setOfCheckedId = new Set<number>();

  // Create Refund Modal
  isVisible = false;
  loading = false;

  constructor(
    private refundService: RefundService,
    private msg: NzMessageService,
  ) {
  }

  ngOnInit(): void {
    this.getAllRefund();
  }

  getAllRefund() {
    this.loading= true;
    this.refundService.getAll()
      .subscribe(res => {
        this.listOfData = res.data;
        this.loading = false;
      }, err => {
        this.msg.create('error', err.message, {
          nzDuration: 5000
        });
      })
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
}
