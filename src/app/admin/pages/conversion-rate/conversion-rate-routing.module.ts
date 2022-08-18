import { ConversionRateComponent } from './conversion-rate.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddConversionRateComponent } from './add-conversion-rate/add-conversion-rate.component';

const routes: Routes = [
  {
    path: '',
    component: ConversionRateComponent,
  },
  {
    path: 'add-conversion-rate',
    component: AddConversionRateComponent,
  },
  {
    path: 'add-conversion-rate/:id',
    component: AddConversionRateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConversionRateRoutingModule {}
