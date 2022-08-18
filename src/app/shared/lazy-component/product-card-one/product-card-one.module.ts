import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardOneComponent } from './product-card-one.component';
import { PipesModule } from '../../pipes/pipes.module';



@NgModule({
  declarations: [
    ProductCardOneComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PipesModule,
  ],
  exports:[
    ProductCardOneComponent
  ]
})
export class ProductCardOneModule { }
