import { NzImageModule } from 'ng-zorro-antd/image';
import { ProductCardOneModule } from './../../shared/lazy-component/product-card-one/product-card-one.module';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AddToCartPopupComponent } from './add-to-cart-popup/add-to-cart-popup.component';
import { BuyNowForNewUserComponent } from './buy-now-for-new-user/buy-now-for-new-user.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import {RegistrationDialogModule} from "../../shared/dialog-view/registration-dialog/registration-dialog.module";


@NgModule({
  declarations: [
    ProductDetailsComponent,
    AddToCartPopupComponent,
    BuyNowForNewUserComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    MatDialogModule,
    MaterialModule,
    SwiperModule,
    ProductCardOneModule,
    PipesModule,
    NgxSpinnerModule,
    NzImageModule,
    RegistrationDialogModule

  ]
})
export class ProductDetailsModule { }
