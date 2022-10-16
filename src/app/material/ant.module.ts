import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
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
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';

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
  NzIconModule,
  NzButtonModule,
  NzCheckboxModule,
  NzCardModule,
  NzTabsModule,
  NzMenuModule,
  NzDropDownModule,
  NzGridModule,
  NzDividerModule,
  NzDatePickerModule,
  NzBadgeModule,
  NzMenuModule,
  NzToolTipModule,
  NzTimelineModule,
  NzCollapseModule,
  NzRadioModule,
  NzImageModule,
  NzAnchorModule,

  // SharedModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, materials],
  exports: [materials],
})
export class AntModule {}
