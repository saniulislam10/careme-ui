import { Component, OnInit, ViewChild } from '@angular/core';
import { ReturnService } from 'src/app/services/return.service';
import { CreateReturnComponent } from 'src/app/shared/create-return/create-return.component';

@Component({
  selector: 'app-return-page',
  templateUrl: './return-page.component.html',
  styleUrls: ['./return-page.component.scss']
})
export class ReturnPageComponent implements OnInit {
  @ViewChild('createReturn') createReturn: CreateReturnComponent;

  returns: any[] = [];

  constructor(
    private returnService: ReturnService
  ) { }

  ngOnInit(): void {
    this.getAllReturns();
  }

  getAllReturns(){
    this.returnService.getAllReturns()
    .subscribe(res => {
      this.returns = res.data;
    }, err=>{
      console.log(err);
    })
  }

  createReturnPopUp(){
    this.createReturn.createReturnShow();
  }



}
