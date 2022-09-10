import {BrowserModule, Meta, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {OverlayContainer} from '@angular/cdk/overlay';
import {CustomOverlayContainer} from './core/utils/custom-overlay-container';
import {ErrorHandleInterceptor} from './error-handler/error-handle.interceptor';
import {AuthAdminInterceptor} from './auth-interceptor/auth-admin.interceptor';
import {SharedModule} from './shared/shared.module';
import {AdminService} from './services/admin.service';
import {AuthUserInterceptor} from './auth-interceptor/auth-user.interceptor';
import {CookieService} from 'ngx-cookie-service';
import {FacebookModule} from 'ngx-facebook';
import {QuillModule} from 'ngx-quill';
import {NgxDropzoneModule} from 'ngx-dropzone';
// import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    AppRoutingModule,
    BrowserAnimationsModule,
    LoadingBarModule,
    LoadingBarRouterModule,
    HttpClientModule,
    SharedModule,
    NzMessageModule,
    // Angular Firebase Config
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    // Ngx Facebook
    FacebookModule.forRoot(),
    NgxDropzoneModule,
    QuillModule.forRoot(),
  ],
  providers: [
    Title,
    Meta,
    CookieService,
    AdminService,
    {provide: OverlayContainer, useClass: CustomOverlayContainer},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandleInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthUserInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthAdminInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
