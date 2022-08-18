import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryMenuRoutingModule } from './category-menu-routing.module';
import { CategoryMenuComponent } from './category-menu.component';
import { AddCategoryMenuComponent } from './add-category-menu/add-category-menu.component';
import { MenuHoverContentComponent } from './menu-hover-content/menu-hover-content.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    CategoryMenuComponent,
    AddCategoryMenuComponent,
    MenuHoverContentComponent
  ],
  imports: [
    CommonModule,
    CategoryMenuRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
    NgxSpinnerModule,
    FlexLayoutModule
  ]
})
export class CategoryMenuModule { }
