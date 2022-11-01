import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShippingService } from './../../../../services/shipping.service';
import { ProductType } from './../../../../interfaces/product-type';
import { Category } from './../../../../interfaces/category';
import { ProductTypeService } from './../../../../services/product-type.service';
import { Zila } from './../../../../interfaces/zila';
import { ZilaService } from './../../../../services/zila.service';
import { Component, OnInit } from '@angular/core';
import { ShippingMethod } from 'src/app/interfaces/shipping-method';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss'],
})
export class CreateShippingZoneComponent implements OnInit {
  // For Details
  zoneVisible = false;
  chooseProduct = 'all';
  chooseRateType = 'flat';
  zoneChoose = true;
  shippingMethod = [
    {
      name: 'General Method',
      value: 1,
    },
    {
      name: 'Sameday Method',
      value: 2,
    },
    {
      name: 'Nextday Method',
      value: 3,
    },
    {
      name: 'Own Pick Method',
      value: 4,
    },
  ];

  // Choose Category
  listOfCatOption: ProductType[] = [];
  listOfProOption: ProductType[] = [];
  selectedCatOptions = [];
  zila: Zila[];
  methods: ShippingMethod[] = [];
  selectedZoneList: Zila[] =[]
  showRate: boolean;
  methodIndex: number;
  selectedAllZila: boolean = false;

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

  constructor(
    private zilaService: ZilaService,
    private productTypeService: ProductTypeService,
    private shippingService: ShippingService,
    private fb: FormBuilder,
    private msg: NzMessageService,
  ) {}

  ngOnInit(): void {
    // Choose Category
    this.getAllCat();
    this.getAllZila();
    this.getAllShippingMethods();
    this.initModule();
  }

  initModule(){
    this.dataForm = this.fb.group({
      name: [null, Validators.required]
    });
  }
  // For Details
  showZoneModal(): void {
    this.zoneVisible = true;
  }
  zoneOk(): void {
    this.selectedZoneList = [];
    this.zila.forEach(m => {
      if(m.checked === true){
        this.selectedZoneList.push(m);
      }
    })
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
    console.log('Button ok clicked!', this.methodIndex);
    if(this.methodIndex >=0){
      this.methods[this.methodIndex].condition = this.chooseRateType;
      if(this.chooseRateType === 'flat'){
        this.methods[this.methodIndex].flatRate = this.flatRate;
      }else if(this.chooseRateType === 'weight'){
        this.methods[this.methodIndex].baseRate = this.baseRate;
        this.methods[this.methodIndex].perKgRate = this.perKgRate;
      }
    }
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

  setRate(i: number){
    this.showRate = true;
    this.methodIndex = i;
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
  getSelectedShippingMethods(){
    let selectedMethods = this.methods.forEach(m => {
        return m
    })
    return selectedMethods;
  }
  onSubmit(){
    console.log(this.dataForm.value)
    if(this.dataForm.invalid){
      this.msg.warning('Please input profile name');
      return
    }
     let data = {
        name: this.dataForm.value.name,
        chooseProduct: this.chooseProduct,
        selectedCategories: this.selectedCatOptions,
        // selectedProducts: this.selectedProducts,
        selectedZones: this.selectedZoneList,
        shippingMethods : this.methods
     }

     this.shippingService.addProfile(data)
     .subscribe(res => {
       this.msg.success(res.message)
     }, err => {
        this.msg.error(err.message)
     })

  }
}
