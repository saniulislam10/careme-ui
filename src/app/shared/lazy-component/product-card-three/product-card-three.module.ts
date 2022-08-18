import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardThreeComponent } from './product-card-three.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductCardThreeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports:[
    ProductCardThreeComponent
  ]
})
export class ProductCardThreeModule { }
