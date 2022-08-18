import { DeshboardComponent } from './deshboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component:DeshboardComponent,
    children:[
      {
        path:"",
        loadChildren: () => import('./orders/order/order.module').then(m => m.OrderModule)
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
        path:"order-details",
        loadChildren: () => import('./orders/order-details/order-details.module').then(m => m.OrderDetailsModule)
      },
      {
        path:"individual-product-status",
        loadChildren: () => import('./orders/individual-product-order-details/individual-product-order-details.module').then(m => m.IndividualProductOrderDetailsModule)
      },
      {
        path:"points",
        loadChildren: () => import('./points/points.module').then(m => m.PointsModule)
      },
      {
        path:"coupons",
        loadChildren: () => import('./coupons/coupons.module').then(m => m.CouponsModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeshboardRoutingModule { }
