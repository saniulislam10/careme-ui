import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Adjustment } from 'src/app/interfaces/adjustment';
import { Pagination } from 'src/app/interfaces/pagination';
import { AdjustmentService } from 'src/app/services/adjustment.service';
import { CreateNewComponent } from '../create-new/create-new.component';

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
      title: 'Available',
      compare: (a, b) => a.productData?.quantity - b.productData?.quantity,
      priority: 2
    },
    {
      title: 'Unit Cost Price',
      compare: (a, b) => a.productData?.costPrice - b.productData?.costPrice,
      priority: 1
    },
    {
      title: 'Damage Qty',
      compare: (a, b) => a.damageQuantity - b.damageQuantity,
      priority: 1
    },
    {
      title: 'Damage Price',
      compare: (a, b) => a.damageAmount - b.damageAmount,
      priority: 1
    },
    {
      title: 'Issue Media',
      compare: null,
      priority: 1
    },
  ];

  dataSet: Adjustment[] = [];
  itemsPerPage= 10;
  currentPage= 1;
  totalItems= 1;
  public query = null;
  adjustment : Adjustment;
  listOfData: any;
  private subRouteOne?: Subscription;
  id: string;
  constructor(
    private dialog: MatDialog,
    private adjustmentService: AdjustmentService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getDataById(this.id);
      }
    });
    this.getAllData();
  }

  getAllData(){
    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.itemsPerPage.toString(),
    };
    console.log("Get all data");

    this.adjustmentService.getAll(pagination, this.query)
    .subscribe(res=>{
      console.log(res.data);
      this.dataSet = res.data;
    }, err =>{
      console.log(err);
    })
   }

  openDialog2() {
    const dialogRef = this.dialog.open(CreateNewComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  getDataById(id){
    this.adjustmentService.getById(id)
    .subscribe(res=>{
      this.adjustment = res.data;
      this.listOfData = this.adjustment.products;
      console.log("listOfData");
      console.log(this.listOfData);
    }, err =>{
      console.log(err);
    })
  }
}
