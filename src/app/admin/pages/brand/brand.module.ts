import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MaterialModule } from 'src/app/material/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzImageModule } from 'ng-zorro-antd/image';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [BrandComponent],
  imports: [
    CommonModule,
    BrandRoutingModule,
    MaterialModule,
    SharedModule,
    MatProgressSpinnerModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzUploadModule,
    NzIconModule,
    NzModalModule,
    NzDividerModule,
    NzImageModule,
    ReactiveFormsModule,
    AntModule,
  ],
})
export class BrandModule {}
