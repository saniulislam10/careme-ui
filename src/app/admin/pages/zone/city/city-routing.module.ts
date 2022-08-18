import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';
import { AddCityComponent } from './add-city/add-city.component';

const routes: Routes = [
  {path: '', component: CityComponent},
  {path: 'add-city', component: AddCityComponent},
  {path: 'edit-city/:id', component: AddCityComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
