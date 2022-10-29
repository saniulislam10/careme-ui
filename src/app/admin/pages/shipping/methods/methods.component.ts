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
      isClosed: true,
    },
    {
      day: 'Monday',
      isClosed: true,
    },
    {
      day: 'Tuesday',
      isClosed: true,
    },
    {
      day: 'Wednesday',
      isClosed: true,
    },
    {
      day: 'Thursday',
      isClosed: true,
    },
    {
      day: 'Friday',
      isClosed: true,
    },
    {
      day: 'Saturday',
      isClosed: true,
    },
  ];

  dataForm: FormGroup;
  inStockDeliveryTimesArray: FormArray;
  preOrderDeliveryTimesArray: FormArray;
  openingTimesArray: FormArray;
  showInStock: boolean = true;
  showPreOrder: boolean = false;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService
  ) { }

  ngOnInit(): void {
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      customOpeningTime: [false, Validators.required],
      openingTimesArray: this.fb.array([]),
      productTypeInStock: [true, Validators.required],
      productTypePreOrder: [false, Validators.required],
      inStockDeliveryOption: [null, Validators.required],
      inStockDeliveryCustomRange: [null],
      inStockDeliveryTimesArray: this.fb.array([]),
      bufferTime: [null],
      preOrderDeliveryOption: [null, Validators.required],
      preOrderDeliveryCustomRange: [null],
      preOrderDeliveryTimesArray: this.fb.array([]),
    })

    this.inStockDeliveryTimesArray = this.dataForm.get(
      'inStockDeliveryTimesArray'
    ) as FormArray;
    this.preOrderDeliveryTimesArray = this.dataForm.get(
      'preOrderDeliveryTimesArray'
    ) as FormArray;

  }



  showMathod(): void {
    this.initModule();
    this.showInStock = true;
    this.showPreOrder = false;
    this.isMethodVisible = true;
  }
  mathodOk(): void {
    console.log('Button ok clicked!');
    console.log(this.dataForm.value);
    if (this.dataForm.invalid) {
      this.msg.warning('Please input all the required fields');
      return
    }
    this.isMethodVisible = false;
  }
  mathodCancel(): void {
    console.log('Button cancel clicked!');
    this.isMethodVisible = false;
  }

  addInStockDeliveryTime() {
    this.inStockDeliveryTimesArray.push(
      this.fb.group({
        startTime: new FormControl (),
        endTime: new FormControl (),
      })
    )
  }

  addPreOrderDeliveryTime() {
    this.preOrderDeliveryTimesArray.push(
      this.fb.group({
        startTime: new FormControl (),
        endTime: new FormControl (),
      })
    )
  }


}
