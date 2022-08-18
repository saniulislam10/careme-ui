import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from "@angular/forms";
import {UiService} from "../../../services/ui.service";
import {Address} from "../../../interfaces/address";
import {UserDataService} from "../../../services/user-data.service";
import {ReloadService} from "../../../services/reload.service";

@Component({
  selector: 'app-add-new-adress',
  templateUrl: './add-new-adress.component.html',
  styleUrls: ['./add-new-adress.component.scss']
})
export class AddNewAdressComponent implements OnInit {
  @ViewChild('formTemplate') formTemplate: NgForm;

  pupUp = false;

  dataForm?: FormGroup;

  address: Address[];

  data: any;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private userDataService: UserDataService,
    private reloadService: ReloadService,

  ) { }

  ngOnInit(): void {
    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });

    this.getUserAddress();

    this.initFormGroup();
  }

  /**
   * INIT FORM
   */

  private initFormGroup() {

    this.dataForm = this.fb.group({
      addressType: [null],
      city: [null, Validators.required],
      thana: [null, Validators.required],
      zilla: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null],
    });

  }



  // city
  city = [
    {name: "dhaka"},
    {name: "comilla"},
    {name: "barishal"},
  ]

  // city
  zilla = [
    {name: "comilla"},
    {name: "rajshahi"}
  ]

  // city
  thana = [
    {name: "daudkandi"},
    {name: "chandina"}
  ]

  addressType: string[] = ['Home', 'Work', 'Other'];

  /****
   *
   * PupUP area
   */

  showPopUp(data){
    this.dataForm.patchValue(data);
    this.pupUp = true;
  }
  hidePopUp(){
    this.pupUp = false;
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    const finalData = {...this.dataForm.value};

    // this.addAddress(finalData);
    // if (this.data) {
    //   this.editAddress();
    // } else {
      this.addAddress(finalData);
    // }
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
        this.reloadService.needRefreshAddress$();
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
      }, error => {
        console.log(error);
      });
  }


}
