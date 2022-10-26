import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddProductRoutingModule} from './add-new-product-routing.module';
import {MaterialModule} from '../../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AddNewProductComponent } from './add-new-product.component';
import { QuillModule } from 'ngx-quill'
import { NgxDropzoneModule } from 'ngx-dropzone';
import {HttpClientModule} from '@angular/common/http';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { ImageGalleryDialogModule } from '../../image-gallery-dialog/image-gallery-dialog.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatChipsModule} from '@angular/material/chips';
import { AntModule } from 'src/app/material/ant.module';

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
    FormsModule,
    ImageGalleryDialogModule,
    MatSelectFilterModule,
    DigitOnlyModule,
    HttpClientModule,
    QuillModule.forRoot(),
    NgxDropzoneModule,
    PipesModule,
    MatChipsModule,
    AntModule
  ]
})
export class AddNewProductModule {
}
