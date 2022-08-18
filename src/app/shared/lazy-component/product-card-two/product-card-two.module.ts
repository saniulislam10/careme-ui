import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardTwoComponent } from './product-card-two.component';



@NgModule({
  declarations: [
    ProductCardTwoComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    ProductCardTwoComponent
  ]
})
export class ProductCardTwoModule { }
