import { Component, Input, OnInit } from '@angular/core';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';

@Component({
  selector: 'app-product-card-three',
  templateUrl: './product-card-three.component.html',
  styleUrls: ['./product-card-three.component.scss']
})
export class ProductCardThreeComponent implements OnInit {
  @Input() data?:ProductCardOne;

  constructor() { }

  ngOnInit(): void {
  }


}
