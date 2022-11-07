import { Component, OnInit } from '@angular/core';
import { NzTabPosition } from 'ng-zorro-antd/tabs';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  stockTabs = ['Overview', 'History'];

  tabs: any[];
  nzTabPosition: NzTabPosition = 'left';
  selectedIndex = 27;

  log(args: any[]): void {
    console.log(args);
  }
  constructor(
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.getAllData();
  }
  getAllData(){
    this.productService.getAllProducts(null, null)
    .subscribe(res=>{
      console.log(res.data);
      this.tabs = res.data;
    }, err =>{
      console.log(err);
    })
  }

}
