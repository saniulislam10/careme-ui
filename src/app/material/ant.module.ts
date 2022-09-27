import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

const materials = [
  NzModalModule,
  NzTableModule,
  NzInputModule,
  NzMessageModule,
  NzSelectModule,
  OverlayModule,
  DragDropModule,
  ReactiveFormsModule,
  FormsModule,
  ReactiveFormsModule,
  NzLayoutModule,
  // SharedModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, materials],
  exports: [materials],
})
export class AntModule {}
