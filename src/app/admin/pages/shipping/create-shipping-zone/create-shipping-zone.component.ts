import { Subscription } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ShippingService } from './../../../../services/shipping.service';
import { ProductType } from './../../../../interfaces/product-type';
import { Category } from './../../../../interfaces/category';
import { ProductTypeService } from './../../../../services/product-type.service';
import { Zila } from './../../../../interfaces/zila';
import { ZilaService } from './../../../../services/zila.service';
import { Component, OnInit } from '@angular/core';
import { ShippingMethod } from 'src/app/interfaces/shipping-method';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippingProfile } from 'src/app/interfaces/shipping-profile';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss'],
})
export class CreateShippingZoneComponent implements OnInit {
  // For Details
  zoneVisible = false;
  chooseRateType = 'flat';
  zoneChoose = true;
  index: number;

  // Choose Category
  listOfCatOption: ProductType[] = [];
  listOfProOption: ProductType[] = [];
  selectedCatOptions = [];
  zila: Zila[];
  methods: ShippingMethod[] = [];
  selectedZoneList: Zila[] = []
  showRate: boolean;
  selectedAllZila: boolean = false;
  zonename: string;

  /**
   * check
   */
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];
  dataForm: FormGroup;
  flatRate: number = 150;
  baseRate: number = 150;
  perKgRate: number = 150;
  id: string;
  subRouteOne: Subscription;
  shippingZonesArray: FormArray;
  shippingProfile: ShippingProfile;

  constructor(
    private zilaService: ZilaService,
    private productTypeService: ProductTypeService,
    private shippingService: ShippingService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getDataById(this.id);
      }
    });
    // Choose Category
    this.getAllCat();
    this.getAllZila();
    this.getAllShippingMethods();
    this.initModule();
  }

  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      shippingZonesArray: this.fb.array([]),
    });
    this.shippingZonesArray = this.dataForm.get(
      'shippingZonesArray'
    ) as FormArray;
    if (!this.id) {
      this.addShippingZonesArray();
    }
  }

  addShippingZonesArray() {
    this.shippingZonesArray.push(
      this.fb.group({
        zones: [],
        name: new FormControl(),
        chooseRateType: ['weight', Validators.required],
        flatRate: [0],
        baseRate: [0],
        perKgRate: [0],
      })
    );
  }
  deleteShippingZonesArray(index) {
    this.shippingZonesArray.removeAt(index);
  }
  // For Details
  showZoneModal(i): void {
    this.index = i;
    this.zoneVisible = true;
  }
  zoneOk(): void {
    this.selectedZoneList = [];
    this.zila.forEach(m => {
      if (m.checked === true) {
        this.selectedZoneList.push(m);
      }
    })
    console.log(this.index);
    console.log(this.zonename);
    console.log(this.shippingZonesArray);
    this.shippingZonesArray.value[this.index].name = this.zonename;
    this.shippingZonesArray.value[this.index].zones = this.selectedZoneList;
    console.log(this.shippingZonesArray.value[this.index].zones);
    this.index = null;
    this.zoneVisible = false;
  }
  zoneCancel(): void {
    console.log('Button cancel clicked!');
    this.zoneVisible = false;
  }
  onCancel(): void {
    console.log('Button cancel clicked!');
    this.showRate = false;
  }
  onOk(): void {
    console.log('Button ok clicked!');
    this.showRate = false;
  }

  getAllZila() {
    this.zilaService.getAllZila()
      .subscribe(res => {
        console.log(res);
        this.zila = res.data;
        this.zila.forEach(m => {
          m.checked = true;
          m.label = m.name;
          m.value = m._id;
        })
      }, error => {
        console.log(error);
      });
  }
  getAllCat() {
    this.productTypeService.getAll()
      .subscribe(res => {
        console.log(res);
        this.listOfCatOption = res.data;
      }, error => {
        console.log(error);
      });
  }
  getAllShippingMethods() {
    this.shippingService.getAll()
      .subscribe(res => {
        console.log(res.data);
        this.methods = res.data;
      }, error => {
        console.log(error);
      });
  }

  getDataById(id) {
    this.shippingService.getProfileById(id)
      .subscribe(res => {
        this.shippingProfile = res.data;
        if (this.shippingProfile?.shippingZonesArray.length) {
          this.shippingProfile?.shippingZonesArray.forEach(async m => {
            this.addShippingZonesArray();
          })
          this.dataForm.patchValue(this.shippingProfile);
        } else {
          this.dataForm.patchValue(this.shippingProfile);
        }
      }, err => {
        this.msg.error(err.message);

      })
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.zila = this.zila.map(item => ({
        ...item,
        checked: true
      }));
    } else {
      this.zila = this.zila.map(item => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.zila.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.zila.every(item => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  getSelectedShippingMethods() {
    let selectedMethods = this.methods.forEach(m => {
      return m
    })
    return selectedMethods;
  }
  onSubmit() {
    console.log(this.dataForm.value)
    if (this.dataForm.invalid) {
      this.msg.warning('Please input profile name');
      return
    }
    let data = this.dataForm.value;
    if (this.id) {
      const finalData = {...data, ...{_id: this.id}}
      this.editShipping(finalData);
    }else{
      this.addShipping(data);
    }

  }

  addShipping(data){
    this.shippingService.addProfile(data)
        .subscribe(res => {
          this.msg.success(res.message);
          this.router.navigate(['admin/shipping']);
        }, err => {
          this.msg.error(err.message)
        })
  }
  editShipping(data){
    this.shippingService.editProfile(data)
        .subscribe(res => {
          this.msg.success(res.message);
          this.router.navigate(['admin/shipping']);
        }, err => {
          this.msg.error(err.message)
        })
  }
}
