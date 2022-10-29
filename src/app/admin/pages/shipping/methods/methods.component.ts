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
      inStockDeliveryOption: ['C', Validators.required],
      inStockDeliveryCustomRange: [false],
      inStockDeliveryTimesArray: this.fb.array([]),
      bufferTime: [null],
      preOrderDeliveryOption: [null, Validators.required],
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

  // openingTimesArray(): FormArray {
  //   return this.dataForm.get("openingTimesArray") as FormArray
  // }



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
    // for (let i = 0; i < this.openingTimes.length; i++) {
    //   this.openingTimesArray.push(this.createNewOpeningTimesArray(this.openingTimes[i]));
    // }
    this.openingTimes.forEach(m => {
      this.openingTimesArray.push(this.fb.group({
        day: m.day,
        isOpen: new FormControl(true),
        timing: this.fb.array([])
      }));
    })
  }

  // createNewOpeningTimesArray(m): FormGroup {
  //   return this.fb.group({
  //     day: m.day,
  //     isOpen: new FormControl(true),
  //     timing: this.fb.array([])
  //   })
  // }

  openingTiming(dayIndex: number) : FormArray {
    return this.openingTimesArray.at(dayIndex).get("timing") as FormArray
  }

  newTiming(): FormGroup {
    return this.fb.group({
      startTime: new FormControl(),
      endTime: new FormControl(),
    })
  }

  addTiming(dayIndex:number) {
    console.log(this.openingTiming(dayIndex))
    this.openingTiming(dayIndex).push(this.newTiming());
  }

  removeTiming(dayIndex:number,timeIndex:number) {
    this.openingTiming(dayIndex).removeAt(timeIndex);
  }


}
