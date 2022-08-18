import { Component, OnInit, ViewChild } from '@angular/core';

import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';

import {ActivatedRoute} from '@angular/router';

import {NgxSpinnerService} from 'ngx-spinner';

import { UiService } from 'src/app/services/ui.service';

import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';
import { Thana } from 'src/app/interfaces/thana';
import { ThanaService } from 'src/app/services/thana.service';
import { City } from 'src/app/interfaces/city';
import { CityService } from 'src/app/services/city.service';
import { Zila } from 'src/app/interfaces/zila';
import { ZilaService } from 'src/app/services/zila.service';

@Component({
  selector: 'app-add-thana',
  templateUrl: './add-thana.component.html',
  styleUrls: ['./add-thana.component.scss']
})
export class AddThanaComponent implements OnInit {

  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
   thana: Thana;
   city: City[] ;
   zila: Zila[] = [];

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private thanaService: ThanaService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private cityService: CityService,
    private zilaService:ZilaService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      cityname: [null, Validators.required],
      zilaname: [null, Validators.required],
    });
    // this.getAllCity();
    this.getAllZila();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getThanaByThanaId();
      }
    });
  }



  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.thana) {
      const finalData = {...this.dataForm.value, ...{_id: this.thana._id}};
      this.editThanaData(finalData);
    } else {
      this.addThana(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'THANA_INPUT');
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addThana(data: Thana) {
    this.spinner.show();
    this.thanaService.addThana(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getThanaByThanaId() {
    this.spinner.show();


    this.thanaService.getThanaByThanaId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.thana = res.data;
          this.getAllCityByZilaId(this.thana.zilaname);
          if(this.thana){
            this.dataForm.patchValue(this.thana);
          }
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editThanaData(data: Thana) {
    this.spinner.show();
    this.thanaService.editThanaData(data)
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

  getAllZila() {
    this.spinner.show();
    this.zilaService.getAllZila()
      .subscribe(res => {
        this.spinner.hide();
        this.zila = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }
getAllCityByZilaId(zilaId: string){
  this.spinner.show();

  this.cityService.getAllCityByZilaId(zilaId)
  .subscribe(res => {
    this.spinner.hide();
    this.city = res.data;
    this.dataForm.patchValue({
      city: this.thana.cityname,
    })
    // this.filtercity = this.city.slice();
  }, error => {
    this.spinner.hide();
    console.log(error);
  });
}




}
