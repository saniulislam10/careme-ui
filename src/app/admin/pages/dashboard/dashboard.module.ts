import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BarChartModule, LineChartModule } from '@swimlane/ngx-charts';
import { TilesComponent } from './tiles/tiles.component';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { InfoCardsComponent } from './info-cards/info-cards.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  declarations: [DashboardComponent, TilesComponent, InfoCardsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    FlexLayoutServerModule,
    LineChartModule,
    NzButtonModule,
    BarChartModule,
    NzCardModule,
    NzGridModule,
    NzDatePickerModule,
  ],
})
export class DashboardModule {}
