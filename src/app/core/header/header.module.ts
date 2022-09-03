import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MenuHoverContentComponent } from './menu-hover-content/menu-hover-content.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';

@NgModule({
  declarations: [HeaderComponent, MenuHoverContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    NzUploadModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
