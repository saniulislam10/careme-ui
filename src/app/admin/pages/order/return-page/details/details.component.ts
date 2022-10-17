import { OrderStatus } from './../../../../../enum/order-status';
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
import { FlexAlignStyleBuilder } from '@angular/flex-layout';

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
  public sortQuery = { createdAt: -1 };
  private subRouteOne?: Subscription;
  id: string;
  editSku: string;
  saveButtonDisable: boolean = true;

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

    this.returnService.getAllReturns(pagination, this.sortQuery)
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
    let status = 7;
    this.return.products.forEach(element => {
      if(element.recievedQty === 0){
        status = 8;
      }
    });
    this.return.deliveryStatus = status;
    console.log(this.return.deliveryStatus);
    this.returnService.recieveReturnById(this.return._id, this.return)
    .subscribe(res => {
      this.msg.create('success', res.message);
      this.saveButtonDisable = true;
    }, err => {
      this.msg.create('error', err.message)
    })
  }

  markRecieved(i, value){
    if(value){
      this.listOfData[i].recievedQty = value;
      this.listOfData[i].returnedQty = value;
      this.saveButtonDisable = false;
    }else{
      this.listOfData[i].returnedQty = 0;
      this.listOfData[i].recievedQty = 0;
      this.saveButtonDisable = false;
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


