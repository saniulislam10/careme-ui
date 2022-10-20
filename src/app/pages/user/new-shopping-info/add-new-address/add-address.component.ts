import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {UiService} from "../../../../services/ui.service";
import {Address} from "../../../../interfaces/address";
import {UserDataService} from "../../../../services/user-data.service";
import {ReloadService} from "../../../../services/reload.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { CityService } from 'src/app/services/city.service';
import { ThanaService } from 'src/app/services/thana.service';
import { ZilaService } from 'src/app/services/zila.service';
import { Zila } from 'src/app/interfaces/zila';
import { City } from 'src/app/interfaces/city';
import { Thana } from 'src/app/interfaces/thana';
import { StorageService } from 'src/app/services/storage.service';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit,OnDestroy {

  @ViewChild('formTemplate') formTemplate: NgForm;

  pupUp = false;

  dataForm?: FormGroup;

  address: Address[];

  private subReload: Subscription;
  zilla: Zila[] = [];
  cities: City[] = [];
  thanas: Thana[] = [];
  // data: any;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private cityService: CityService,
    private zilaService:ZilaService,
    private thanaService: ThanaService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<AddAddressComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Address,
  ) { }

  ngOnInit(): void {
    // this.reloadService.refreshAddress$.subscribe(() => {
    //   this.getUserAddress();
    // });

    // this.getUserAddress();

    this.initFormGroup();

    if(this.data){
      console.log(this.data);
      this.dataForm.patchValue(this.data);
      this.dataForm.patchValue({
        zila: this.data.zila._id,
      });
      this.getAllCityByZilaId(this.data.zila._id);
      this.getAllThanaByCityId(this.data.city._id);
    }

    this.getAllZila();

  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  /**
   * INIT FORM
   */

  private initFormGroup() {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      addressType: [null],
      city: [null, Validators.required],
      thana: [null, Validators.required],
      zila: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null],
    });

  }

  /**
   * Http Req
   */

  getAllZila() {
    this.spinner.show();
    this.zilaService.getAllZila()
      .subscribe(res => {
        this.spinner.hide();
        this.zilla = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  getAllCityByZilaId(zilaId: string){
    this.spinner.show();

    this.cityService.getAllCityByZilaId(zilaId)
    .subscribe(res => {
      this.cities = res.data;
      if(this.data){
        this.dataForm.patchValue({
          city: this.data.city._id,
        })
      };
      // this.filtercity = this.city.slice();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  getAllThanaByCityId(cityId: string){
    this.spinner.show();

    this.thanaService.getAllThanasByCityId(cityId)
    .subscribe(res => {
      this.thanas = res.data;
      if(this.data){
        this.dataForm.patchValue({
          thana: this.data.thana._id,
        })
      };

      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }


  addressType: string[] = ['Home', 'Work', 'Other'];

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    const finalData = {...this.dataForm.value};

    if (this.data) {
      console.log(this.data);
      this.editAddress();
    }else{
      this.addAddress(finalData);
    }
  }


  /**
   * Http
   * @param data
   */

  addAddress(data: Address) {

    this.userDataService.addToAddress(data)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.formTemplate.resetForm();
        this.reloadService.needRefreshAddress$();
        // this.matDialog.closeAll();
        this.dialogRef.close()
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
      .subscribe(res => {
        this.address = res.data;
        res.data.map(m => {
          this.data = m;
        })
      }, err => {
        console.log(err);
      });
  }

  editAddress() {
    const finalData = {...this.dataForm.value, ...{_id: this.data._id}};
    this.userDataService.editAddress(finalData)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAddress$();
        // this.dialogRef.close();
        // this.matDialog.closeAll();
        this.dialogRef.close()
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy(): void {

  }
}
