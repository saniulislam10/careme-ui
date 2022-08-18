import { Component, OnInit, ViewChild } from '@angular/core';

import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {ActivatedRoute} from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';
import { City } from 'src/app/interfaces/city';
import { UiService } from 'src/app/services/ui.service';
import { CityService } from 'src/app/services/city.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';
import { Zila } from 'src/app/interfaces/zila';
import { ZilaService } from 'src/app/services/zila.service';


@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  city: City;
  zila: Zila[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private cityService: CityService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private zilaService:ZilaService ,
  ) { }

  ngOnInit(): void {
    // this.dataForm = this.fb.group({
    //   name: [null, Validators.required],
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      zilaname: [null, Validators.required],
    });

    // GET ID FORM PARAM

    this.getAllZila();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCityByCitytId();
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.city) {
      const finalData = {...this.dataForm.value, ...{_id: this.city._id}};
      this.editCityData(finalData);
    } else {
      this.addCity(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'CITY_INPUT');
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addCity(data: City) {
    this.spinner.show();
    this.cityService.addCity(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getCityByCitytId() {
    this.spinner.show();
    this.cityService.getCityByCitytId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.city = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editCityData(data: City) {
    this.spinner.show();
    this.cityService.editCityData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('CITY_INPUT');
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
  getAllZila() {
    this.spinner.show();
    this.zilaService.getAllZila()
      .subscribe(res => {
        console.log(res);
        this.spinner.hide();
        this.zila = res.data;

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


}
