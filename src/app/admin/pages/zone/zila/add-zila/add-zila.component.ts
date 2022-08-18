import { Component, OnInit, ViewChild } from '@angular/core';


import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {ActivatedRoute} from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';

import { UiService } from 'src/app/services/ui.service';

import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';
import { Zila } from 'src/app/interfaces/zila';
import { ZilaService } from 'src/app/services/zila.service';


@Component({
  selector: 'app-add-zila',
  templateUrl: './add-zila.component.html',
  styleUrls: ['./add-zila.component.scss']
})
export class AddZilaComponent implements OnInit {

  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
   zila: Zila;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private zilaService: ZilaService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],

    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getZilaByzilaId();
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.zila) {
      const finalData = {...this.dataForm.value, ...{_id: this.zila._id}};
      this.editZilaData(finalData);
    } else {
      this.addZila(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'ZILA_INPUT');
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addZila(data: Zila) {
    this.spinner.show();
    this.zilaService.addZila(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getZilaByzilaId() {
    this.spinner.show();
    this.zilaService.getZilaByzilaId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.zila = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editZilaData(data: Zila) {
    this.spinner.show();
    this.zilaService.editZilaData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('thana_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


}
