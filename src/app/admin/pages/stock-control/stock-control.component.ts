import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockControlService } from 'src/app/services/stock-control.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-stock-control',
  templateUrl: './stock-control.component.html',
  styleUrls: ['./stock-control.component.scss']
})
export class StockControlComponent implements OnInit {

  searchProduct = false;
  dataForm?: FormGroup;
  stockControlData: any;
  constructor(
    private fb: FormBuilder,
    private stockControlService: StockControlService,
    private uiService: UiService,
  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.getStockControl();
  }

  private initFormGroup() {
    this.dataForm = this.fb.group({
      lessThanZero: [null, Validators.required],
      zero: [null, Validators.required],
      greaterThanZero: [null, Validators.required],
    });

  }

  onSubmit(){
    if(this.stockControlData){
      this.editStockControl();
    }else{
      this.addStockControl();

    }
  }

  addStockControl(){
    this.stockControlService.addStockControl(this.dataForm.value)
    .subscribe(res=> {
      this.uiService.success(res.message);
    }, err=> {
      console.log(err);
    })
  }

  editStockControl(){
    const finalData = {...this.dataForm.value, ...{_id: this.stockControlData._id}};
    this.stockControlService.editStockControl(finalData)
    .subscribe(res=> {
      this.uiService.success(res.message);
    }, err=> {
      console.log(err);
    })
  }

  getStockControl(){
    this.stockControlService.getAllStockControl()
    .subscribe(res=> {
      this.stockControlData = res.data;
      this.dataForm.patchValue(this.stockControlData);
    }, err=> {
      console.log(err);
    })
  }

  searchProductActive(){
    this.searchProduct = true;
  }

  searchProductInactive(){
    this.searchProduct = false;
  }


}
