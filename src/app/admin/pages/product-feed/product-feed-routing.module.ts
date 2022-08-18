import { ProductFeedSettingComponent } from './product-feed-setting/product-feed-setting.component';
import { ProductFeedPixelComponent } from './product-feed-pixel/product-feed-pixel.component';
import { ProductFeedComponent } from './product-feed.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component:ProductFeedComponent,
    children:[
      {
        path:"",
        component:ProductFeedPixelComponent
      },
      {
        path:"settings",
        component:ProductFeedSettingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductFeedRoutingModule { }
