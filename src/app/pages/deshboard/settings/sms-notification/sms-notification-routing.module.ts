import { SmsNotificationComponent } from './sms-notification.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
   path:"",
   component:SmsNotificationComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsNotificationRoutingModule { }
