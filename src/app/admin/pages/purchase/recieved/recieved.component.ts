import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { id } from '@swimlane/ngx-charts';
import { Purchase } from 'src/app/interfaces/purchase';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-recieved',
  templateUrl: './recieved.component.html',
  styleUrls: ['./recieved.component.scss']
})
export class RecievedComponent implements OnInit {

  public dataForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private reloadService: ReloadService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    public dialogRef: MatDialogRef<RecievedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initFormValue();
  }

  initFormValue() {
    this.dataForm = this.fb.group({
      recieved: [0],
      message: [null],
    });
  }

  onSubmit(){
    let totalRecieved = this.data.recieved ?  this.data.recieved + this.dataForm.value.recieved: this.dataForm.value.recieved
    if(totalRecieved > this.data.purchaseQuantity){
      this.uiService.warn("Cannot recieve more than purchase quantity");
      return
    }
    console.log("Product Info : ", this.data)
    let finalData = {
      _id: this.data.id,
      productId: this.data.productId,
      index: this.data.index,
      recieved: this.dataForm.value.recieved,
      message: this.dataForm.value.message,
    }
    console.log(finalData);
    this.editPurchaseRecieved(finalData);

  }
  editPurchaseRecieved(data){
    this.purchaseService.editRecieved(data)
    .subscribe( res =>{
      this.uiService.success(res.message);
      this.reloadService.needRefreshPurchase$();
    },err=>{
      this.uiService.wrong(err.message);
    })
  }

}
