import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MenuHoverContentComponent } from './menu-hover-content/menu-hover-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [HeaderComponent, MenuHoverContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AntModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
