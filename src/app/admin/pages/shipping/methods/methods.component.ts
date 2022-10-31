import { ReloadService } from './../../../../services/reload.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ShippingMethod } from './../../../../interfaces/shipping-method';
import { ShippingService } from './../../../../services/shipping.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit, RendererFactory2 } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-methods',
  templateUrl: './methods.component.html',
  styleUrls: ['./methods.component.scss'],
})
export class MethodsComponent implements OnInit {
  tabs = ['All Invoice', 'Closed', 'Pending'];
  isMethodVisible = false;
  customOpeningTime = false;
  instockValue = 'A';
  preOrderValue = 'A';
  deliveryTime = 'A';

  //  Day Schedule
  disabledSchedule = true;

  // time picker
  startTime: Date;
  endTime: Date;
  defaultOpenValue = new Date();
  allMethods: ShippingMethod[] = []

  shipedTable = [
    {
      name: 'General Method',
    },
    {
      name: 'Sameday Method',
    },
    {
      name: 'Nextday Method',
    },
    {
      name: 'Own Pick Method',
    },
  ];


  openingTimes = [
    {
      day: 'Sunday',
    },
    {
      day: 'Monday',
    },
    {
      day: 'Tuesday',
    },
    {
      day: 'Wednesday',
    },
    {
      day: 'Thursday',
    },
    {
      day: 'Friday',
    },
    {
      day: 'Saturday',
    },
  ];

  dataForm: FormGroup;
  inStockDeliveryTimesArray: FormArray;
  preOrderDeliveryTimesArray: FormArray;
  openingTimesArray: FormArray;
  timingArray: FormArray;
  showInStock: boolean = true;
  showPreOrder: boolean = false;
  id: any;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private shippingService: ShippingService,
    private modal: NzModalService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshShipping$
      .subscribe(() => {
        this.getAll();
      });
    this.getAll();
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      customOpeningTime: [false, Validators.required],
      openingTimesArray: this.fb.array([]),
      productTypeInStock: [true, Validators.required],
      productTypePreOrder: [false, Validators.required],
      inStockDeliveryOption: ['C', Validators.required],
      inStockDeliveryCustomRange: [false],
      inStockDeliveryFrom: [null],
      inStockDeliveryTo: [null],
      inStockDeliveryTimesArray: this.fb.array([]),
      bufferTime: [null],
      preOrderDeliveryFrom: [null],
      preOrderDeliveryTo: [null],
      preOrderDeliveryCustomRange: [false],
      preOrderDeliveryTimesArray: this.fb.array([]),
    })

    this.inStockDeliveryTimesArray = this.dataForm.get(
      'inStockDeliveryTimesArray'
    ) as FormArray;
    this.preOrderDeliveryTimesArray = this.dataForm.get(
      'preOrderDeliveryTimesArray'
    ) as FormArray;
    this.openingTimesArray = this.dataForm.get(
      'openingTimesArray'
    ) as FormArray;
    this.showOpeningTimesArray();

  }



  addInStockDeliveryTime() {
    this.inStockDeliveryTimesArray.push(
      this.fb.group({
        startTime: new FormControl(),
        endTime: new FormControl(),
      })
    )
  }

  addPreOrderDeliveryTime() {
    this.preOrderDeliveryTimesArray.push(
      this.fb.group({
        startTime: new FormControl(),
        endTime: new FormControl(),
      })
    )
  }

  showOpeningTimesArray() {
    this.openingTimes.forEach(m => {
      this.openingTimesArray.push(this.fb.group({
        day: m.day,
        isOpen: new FormControl(true),
        timing: this.fb.array([])
      }));
    })
    if (this.id) {
      console.log(this.id);
    }

  }

  openingTiming(dayIndex: number): FormArray {
    return this.openingTimesArray.at(dayIndex).get("timing") as FormArray
  }

  newTiming(): FormGroup {
    return this.fb.group({
      startTime: new FormControl(),
      endTime: new FormControl(),
    })
  }

  addTiming(dayIndex: number) {
    console.log(this.openingTiming(dayIndex))
    this.openingTiming(dayIndex).push(this.newTiming());
  }

  removeTiming(dayIndex: number, timeIndex: number) {
    this.openingTiming(dayIndex).removeAt(timeIndex);
  }

  removeInStockDeliveryTimesArray(dayIndex) {
    this.inStockDeliveryTimesArray.removeAt(dayIndex);
  }
  removePreOrderDeliveryTimesArray(dayIndex) {
    this.preOrderDeliveryTimesArray.removeAt(dayIndex);
  }

  showMathod(): void {
    this.initModule();

    this.showInStock = true;
    this.showPreOrder = false;
    this.isMethodVisible = true;
  }
  mathodCancel(): void {
    console.log('Button cancel clicked!');
    this.isMethodVisible = false;
    this.id = null;
  }

  /**
   * API
   */


  onSubmit(): void {
    if (this.dataForm.invalid) {
      this.msg.warning('Please input all the required fields');
      return
    }

    let data = this.dataForm.value;
    if (this.id) {
      let finaldata = { ...data, ...{ _id: this.id } };
      this.editMethod(finaldata);
    } else {
      this.addMethod(data);
    }
    this.isMethodVisible = false;
  }

  addMethod(data: ShippingMethod) {
    this.shippingService.add(data)
      .subscribe(res => {
        this.msg.success(res.message);
        this.reloadService.needRefreshShipping$();
      }, err => {
        this.msg.error(err.message);
      })
  }

  editMethod(data: ShippingMethod) {
    this.shippingService.editData(data)
      .subscribe(res => {
        this.msg.success(res.message);
        this.reloadService.needRefreshShipping$();
      }, err => {
        this.msg.error(err.message);
      })
  }

  getAll() {
    this.shippingService.getAll()
      .subscribe(res => {
        console.log(res.data);
        this.allMethods = res.data;
      }, err => {
        this.msg.error(err.message);
      })
  }

  showDeleteConfirm(id): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">All the related datas will be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.delete(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  delete(id) {
    this.shippingService.deleteById(id)
      .subscribe(res => {
        this.msg.create('success', res.message);
        this.reloadService.needRefreshShipping$();
      }, err => {
        this.msg.create('error', err.message)
      })
  }

  edit(data: ShippingMethod) {
    this.id = data._id;
    this.initModule();
    if (data.customOpeningTime) {
      for (let i = 0; i < data.openingTimesArray.length; i++) {
        for (let j = 0; j < data.openingTimesArray[i].timing.length; j++) {
          this.addTiming(i);
        }
      }
    }
    if(data.inStockDeliveryCustomRange){
      data.inStockDeliveryTimesArray.forEach(m => {
        this.addInStockDeliveryTime();
      })
    }
    if(data.preOrderDeliveryCustomRange){
      data.preOrderDeliveryTimesArray.forEach(m => {
        this.addPreOrderDeliveryTime();
      })
    }
    this.dataForm.patchValue(data);
    this.isMethodVisible = true;
  }







}
