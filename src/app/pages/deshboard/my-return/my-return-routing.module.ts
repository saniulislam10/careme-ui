import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyReturnComponent } from './my-return.component';

const routes: Routes = [
  {
    path: '',
    component: MyReturnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyReturnRoutingModule { }
