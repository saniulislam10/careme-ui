import { Component, OnInit } from '@angular/core';

interface ItemData {
  id: number;
}

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
})
export class CouponComponent implements OnInit {
  couponModal = false;

  // Table Data loops
  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

  // Tab Data
  couponTabs = [
    {
      name: 'All Coupon',
      disabled: false,
    },
    {
      name: 'Active',
      disabled: false,
    },
    {
      name: 'Scheduled',
      disabled: false,
    },
    {
      name: 'Expired',
      disabled: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.listOfData = new Array(20).fill(0).map((_, index) => ({
      id: index,
    }));
  }

  // Tabs Data loop
  showModal(): void {
    this.couponModal = true;
  }

  couponCancel(): void {
    console.log('Button cancel clicked!');
    this.couponModal = false;
  }

  // Table Data loops
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
