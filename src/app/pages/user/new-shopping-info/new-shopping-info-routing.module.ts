import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewShoppingInfoComponent } from './new-shopping-info.component';

const routes: Routes = [ {path: '', component: NewShoppingInfoComponent,pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewShoppingInfoRoutingModule { }
