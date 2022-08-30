import { AdjustmentComponent } from './adjustment.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { CreateNewComponent } from './create-new/create-new.component';

const routes: Routes = [
  {
    path:"",
    component: AdjustmentComponent
  },
  {
    path:"details/:id",
    component: DetailsComponent
  },
  {
    path:"edit/:id",
    component: CreateNewComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdjustmentRoutingModule { }
