import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultComponent } from './search-result.component';

const routes: Routes = [
  {path: '', component: SearchResultComponent},
  // {path: 'tag/:tagId', component: SearchResultComponent},
  // {path: 'tag/:tagSlug', component: SearchResultComponent},
  // {path: 'my-test', component: SearchResultComponent},
  // {path: ':categorySlug', component: SearchResultComponent},
  // {path: ':categorySlug/:subCategorySlug', component: SearchResultComponent},
  // {path: ':categorySlug/:subCategorySlug/:brandSlug', component: SearchResultComponent},
  // {path: ':brandSlug', component: SearchResultComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchResultRoutingModule { }
