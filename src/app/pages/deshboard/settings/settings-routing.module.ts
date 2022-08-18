import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component:SettingsComponent,
    children:[
      {
        path:"",
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
      },
      {
        path:"payment",
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path:"desktop-notification",
        loadChildren: () => import('./desktop-notification/desktop-notification.module').then(m => m.DesktopNotificationModule)
      },
      {
        path:"app-notification",
        loadChildren: () => import('./app-notification/app-notification.module').then(m => m.AppNotificationModule)
      },
      {
        path:"email-notification",
        loadChildren: () => import('./email/email.module').then(m => m.EmailModule)
      },
      {
        path:"sms-notification",
        loadChildren: () => import('./sms-notification/sms-notification.module').then(m => m.SmsNotificationModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
