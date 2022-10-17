import { PipesModule } from './../../../../shared/pipes/pipes.module';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { AntModule } from 'src/app/material/ant.module';
import { MaterialModule } from 'src/app/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnPageRoutingModule } from './return-page-routing.module';
import { ReturnPageComponent } from './return-page.component';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ReturnPageComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    NzPaginationModule,
    ReturnPageRoutingModule,
    MaterialModule,
    AntModule,
    SharedModule,
    PipesModule
  ]
})
export class ReturnPageModule { }
