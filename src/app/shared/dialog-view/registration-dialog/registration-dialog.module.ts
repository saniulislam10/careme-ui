import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationDialogComponent } from './registration-dialog.component';
import {MaterialModule} from "../../../material/material.module";
import {RegistrationRoutingModule} from "../../../pages/user/registration/registration-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared.module";
import {AngularFireAuthModule} from "@angular/fire/auth";
import {PhoneVerificationDialogModule} from "../../lazy-component/phone-verification-dialog/phone-verification-dialog.module";
import {DigitOnlyModule} from "@uiowa/digit-only";



@NgModule({
  declarations: [
    RegistrationDialogComponent
  ],
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    MaterialModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    PhoneVerificationDialogModule,
    DigitOnlyModule,
  ],
  exports: [
    RegistrationDialogComponent
  ]
})
export class RegistrationDialogModule { }
