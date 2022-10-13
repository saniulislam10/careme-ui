import { FooterModule } from './../shared/components/footer/footer.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderModule } from '../core/header/header.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [PagesComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    HeaderModule,
    FooterModule,
    MatDialogModule,
  ],
})
export class PagesModule {}
