import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddZilaComponent } from './add-zila/add-zila.component';
import { ZilaComponent } from './zila.component';

const routes: Routes = [
  {path: '', component: ZilaComponent},
  {path: 'add-zila', component: AddZilaComponent},
  {path: 'edit-zila/:id', component: AddZilaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ZilaRoutingModule { }
