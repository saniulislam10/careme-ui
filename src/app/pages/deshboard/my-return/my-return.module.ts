import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyReturnRoutingModule } from './my-return-routing.module';
import { MyReturnComponent } from './my-return.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';

@NgModule({
  declarations: [MyReturnComponent],
  imports: [
    CommonModule,
    MyReturnRoutingModule,
    NzCardModule,
    NzTabsModule,
    NzTableModule,
    NzDropDownModule,
    NzGridModule,
    NzInputModule,
  ],
})
export class MyReturnModule {}
