import { Component, Input, OnInit } from '@angular/core';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';

@Component({
  selector: 'app-product-card-two',
  templateUrl: './product-card-two.component.html',
  styleUrls: ['./product-card-two.component.scss']
})
export class ProductCardTwoComponent implements OnInit {
  @Input() data?:ProductCardOne;
  constructor() { }

  ngOnInit(): void {
  }

}
