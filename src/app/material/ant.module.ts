import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzListModule } from 'ng-zorro-antd/list';
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
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

const materials = [
  NzModalModule,
  NzInputModule,
  NzMessageModule,
  OverlayModule,
  DragDropModule,
  FormsModule,
  ReactiveFormsModule,
  NzLayoutModule,
  NzButtonModule,
  NzCheckboxModule,
  NzTabsModule,
  NzDropDownModule,
  NzDatePickerModule,
  NzBadgeModule,
  NzMenuModule,
  NzToolTipModule,
  NzCollapseModule,
  NzRadioModule,
  NzAnchorModule,
  NzDrawerModule,
  NzAffixModule,
  NzSelectModule,
  NzTableModule,
  NzGridModule,
  NzDividerModule,
  NzImageModule,
  NzListModule,
  NzCardModule,
  NzStepsModule,
  NzTimelineModule,
  NzIconModule,
  NzDescriptionsModule,
  NzPopoverModule,
  NzTimePickerModule,
  NzSpinModule,
  NzUploadModule,
  NzSliderModule,
  NzSwitchModule,

  // SharedModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, materials],
  exports: [materials],
})
export class AntModule {}
