import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LangTranslateModule} from '../core/lang-translate/lang-translate.module';
import {RouterModule} from '@angular/router';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import {PipesModule} from './pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { SnackbarNotificationComponent } from './components/ui/snackbar-notification/snackbar-notification.component';
import { MessageDialogComponent } from './components/ui/message-dialog/message-dialog.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { CartViewDialogComponent } from './components/cart-view-dialog/cart-view-dialog.component';
import { BottomSheetViewComponent } from './components/ui/bottom-sheet-view/bottom-sheet-view.component';
import { CookieConsentComponent } from './components/cookie-consent/cookie-consent.component';
import { ConfirmDialogComponent } from './components/ui/confirm-dialog/confirm-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperComponent } from './components/image-cropper/image-crop.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    LangTranslateModule,
    NgxSpinnerModule,
    MaterialModule,
    RouterModule,
    PipesModule,
    FormsModule,
    ImageCropperModule
  ],
  exports: [
    FlexLayoutModule,
    FlexLayoutServerModule,
    SnackbarNotificationComponent,
    MessageDialogComponent,
    LangTranslateModule,
    NgxSpinnerModule,
    ProductCardComponent,
    OutSideClickDirective,
    CartViewDialogComponent,
    BottomSheetViewComponent,
    CookieConsentComponent,


  ],
  declarations: [
    SnackbarNotificationComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    ProductCardComponent,
    OutSideClickDirective,
    CartViewDialogComponent,
    BottomSheetViewComponent,
    CookieConsentComponent,
    ImageCropperComponent
  ],
  providers: [],
  entryComponents: []
})
export class SharedModule {
}
