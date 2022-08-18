import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ThanaComponent } from './thana.component';
import { AddThanaComponent } from './add-thana/add-thana.component';

const routes: Routes = [
  {path: '', component: ThanaComponent},
  {path: 'add-thana', component: AddThanaComponent},
  {path: 'edit-thana/:id', component: AddThanaComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThanaRoutingModule { }
