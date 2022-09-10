import { NzMessageModule } from 'ng-zorro-antd/message';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddProductRoutingModule} from './add-new-product-routing.module';
// import {AddProductComponent} from './add-product.component';
import {MaterialModule} from '../../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AddNewProductComponent } from './add-new-product.component';
// import {NgxEditorModule} from 'ngx-editor';
// import {NgxSpinnerModule} from 'ngx-spinner';
// import {DigitOnlyModule} from '@uiowa/digit-only';
// import {AngularEditorModule} from '@kolkov/angular-editor';
// import {ImageGalleryDialogModule} from '../../image-gallery-dialog/image-gallery-dialog.module';
// import {MatSelectFilterModule} from 'mat-select-filter';
import { QuillModule } from 'ngx-quill'
import { NgxDropzoneModule } from 'ngx-dropzone';
import {HttpClientModule} from '@angular/common/http';
import { SafeHtmlPipe } from 'ngx-spinner/lib/safe-html.pipe';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ImageGalleryDialogModule } from '../../image-gallery-dialog/image-gallery-dialog.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NzTagModule } from 'ng-zorro-antd/tag';
import {MatChipsModule} from '@angular/material/chips';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [
    AddNewProductComponent
  ],
  imports: [
    CommonModule,
    AddProductRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    // NgxEditorModule,
    FormsModule,
    // NgxSpinnerModule,
    // DigitOnlyModule,
    // AngularEditorModule,
    ImageGalleryDialogModule,
    MatSelectFilterModule,
    DigitOnlyModule,
    HttpClientModule,
    QuillModule.forRoot(),
    NgxDropzoneModule,
    PipesModule,
    NzTagModule,
    NzSelectModule,
    MatChipsModule,
    NzUploadModule,
    NzMessageModule,
    NzModalModule
  ]
})
export class AddNewProductModule {
}
