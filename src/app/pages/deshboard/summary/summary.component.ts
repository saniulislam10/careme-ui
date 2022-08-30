import { Component, OnInit } from '@angular/core';

interface ItemData {
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  listOfData: ItemData[] = [];

  constructor() { }

  ngOnInit(): void {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        orderId: `So - 26169${i}`,
        date: new Date(),
        items: 32,
        total: 100,
        status: `Pending`
      });
    }
    this.listOfData = data;
  }

}
