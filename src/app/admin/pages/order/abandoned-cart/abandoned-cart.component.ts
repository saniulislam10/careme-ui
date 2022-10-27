import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { getISOWeek } from 'date-fns';

interface ItemData {
  id: number;
}

@Component({
  selector: 'app-abandoned-cart',
  templateUrl: './abandoned-cart.component.html',
  styleUrls: ['./abandoned-cart.component.scss'],
})
export class AbandonedCartComponent implements OnInit {
  tabs = ['All Invoice', 'Closed', 'Pending'];
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();
  datePicker = null;

  constructor() {}

  ngOnInit(): void {
    this.listOfData = new Array(20).fill(0).map((_, index) => ({
      id: index,
    }));
  }

  // Date Picker
  onChange(result: Date[]): void {
    console.log('onChange: ', result);
  }
  getWeek(result: Date[]): void {
    console.log('week: ', result.map(getISOWeek));
  }

  // Checkbox area
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
