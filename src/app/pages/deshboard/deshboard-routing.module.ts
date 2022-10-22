import { MyAccountModule } from './my-account/my-account.module';
import { SummaryModule } from './summary/summary.module';
import { DeshboardComponent } from './deshboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyReturnModule } from './my-return/my-return.module';

const routes: Routes = [
  {
    path:"",
    component:DeshboardComponent,
    children:[
      {
        path:"",
        loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule)
      },
      {
        path:"subscription",
        loadChildren: () => import('./subscription-page/subscription-page.module').then(m => m.SubscriptionPageModule)
      },
      {
        path:'setting',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path:"tickets",
        loadChildren: () => import('./tickets-page/tickets-page.module').then( m  => m.TicketsPageModule)
      },
      {
        path:"ticket-details",
        loadChildren: () => import('./ticket-details-page/ticket-details-page.module').then(m => m.TicketDetailsPageModule)
      },
      {
        path:"points",
        loadChildren: () => import('./points/points.module').then(m => m.PointsModule)
      },
      {
        path:"coupons",
        loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule)
      },
      {
        path:"summary",
        loadChildren: () => import('./summary/summary.module').then(m => m.SummaryModule)
      },
      {
        path:"account",
        loadChildren: () => import('./my-account/my-account.module').then(m => m.MyAccountModule)
      },
      {
        path:"reviews",
        loadChildren: () => import('./my-reviews/my-reviews.module').then(m => m.MyReviewsModule)
      },
      {
        path:"orders",
        loadChildren: () => import('./my-orders/my-orders.module').then(m => m.MyOrdersModule)
      },
      {
        path:"order-details",
        loadChildren: () => import('./order-details/order-details.module').then(m => m.OrderDetailsModule)
      },
      {
        path:"track-order",
        loadChildren: () => import('./order-single-product-details/order-single-product-details.module').then(m => m.OrderSingleProductDetailsModule)
      },
      {
        path:"canceled-orders",
        loadChildren: () => import('./canceled-order/canceled-order.module').then(m => m.CanceledOrderModule)
      },
      {
        path:"my-return",
        loadChildren: () => import('./my-return/my-return.module').then(m => MyReturnModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeshboardRoutingModule { }
