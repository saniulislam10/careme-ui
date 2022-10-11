import {Return} from './../../../../../interfaces/return';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatMenuTrigger} from '@angular/material/menu';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {Adjustment} from 'src/app/interfaces/adjustment';
import {Pagination} from 'src/app/interfaces/pagination';
import {AdjustmentService} from 'src/app/services/adjustment.service';
import {ReturnService} from 'src/app/services/return.service';
import { NzMessageService } from 'ng-zorro-antd/message';

interface DataItem {
  name: string;
  math: number;
  english: number;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  checked: boolean[] = [false];
  tabs = ['Overview', 'Edit', 'Received', 'Refund'];
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  listOfColumn = [
    {
      title: 'Name',
      compare: (a, b) => a.productData?.name.localeCompare(b.productData?.name),
      priority: false
    },
    {
      title: 'Sku',
      compare: null,
      priority: false
    },
    {
      title: 'Shipped',
      compare: (a, b) => a.productData?.quantity - b.productData?.quantity,
      priority: 2
    },
    {
      title: 'Amount',
      compare: (a, b) => a.productData?.costPrice - b.productData?.costPrice,
      priority: 1
    },
    {
      title: 'Recieved Qty',
      compare: (a, b) => a.damageQuantity - b.damageQuantity,
      priority: 1
    },
    {
      title: 'Refunded',
      compare: (a, b) => a.damageAmount - b.damageAmount,
      priority: 1
    }
  ];

  dataSet: Return[] = [];
  itemsPerPage = 10;
  currentPage = 1;
  totalItems = 1;
  public query = null;
  return: Return;
  listOfData: any;
  private subRouteOne?: Subscription;
  id: string;
  editSku: string;

  constructor(
    private dialog: MatDialog,
    private returnService: ReturnService,
    private msg: NzMessageService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getDataById(this.id);
      }
    });
    this.getAllData();
  }

  getAllData() {
    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.itemsPerPage.toString(),
    };
    console.log("Get all data");

    this.returnService.getAllReturns()
      .subscribe(res => {
        console.log(res.data);
        this.dataSet = res.data;
      }, err => {
        console.log(err);
      })
  }

  getDataById(id) {
    this.returnService.getReturnById(id)
      .subscribe(res => {
        this.return = res.data;
        this.listOfData = this.return.products;
        console.log("listOfData");
        console.log(this.return);
        console.log(this.listOfData);
      }, err => {
        console.log(err);
      })
  }

  startEdit(sku: string): void {
    this.editSku = sku;
  }

  stopEdit(): void {
    this.editSku = null;
  }

  updateReturn(){
    console.log(this.return._id, this.return);
    this.returnService.recieveReturnById(this.return._id, this.return)
    .subscribe(res => {
      this.msg.create('success', res.message);
    }, err => {

    })
  }

  markRecieved(i, value){
    if(value){
      this.listOfData[i].recievedQty = value;
      this.listOfData[i].returnedQty = value;
    }else{
      this.listOfData[i].returnedQty = 0;
      this.listOfData[i].recievedQty = 0;
    }
  }

  getRecievedStatus(a,b){
    if(a === b){
      return true
    }else{
      return false
    }
  }

}


