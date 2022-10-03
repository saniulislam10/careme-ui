import { Component, OnInit } from '@angular/core';
import { products } from 'src/app/core/utils/dashboard.data';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss'],
})
export class TilesComponent implements OnInit {
  public products: any[];
  constructor() {}

  ngOnInit(): void {
    this.products = products;
  }

  public onSelect(event) {
    console.log(event);
  }
}
