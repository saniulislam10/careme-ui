import { AddByLinkComponent } from './add-by-link.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:"",
    component:AddByLinkComponent
  },
  {
    path:":id",
    component:AddByLinkComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddByLinkRoutingModule { }
