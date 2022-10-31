import { ShippingService } from './../../../../services/shipping.service';
import { ProductType } from './../../../../interfaces/product-type';
import { Category } from './../../../../interfaces/category';
import { ProductTypeService } from './../../../../services/product-type.service';
import { Zila } from './../../../../interfaces/zila';
import { ZilaService } from './../../../../services/zila.service';
import { Component, OnInit } from '@angular/core';
import { ShippingMethod } from 'src/app/interfaces/shipping-method';

@Component({
  selector: 'app-create-shipping-zone',
  templateUrl: './create-shipping-zone.component.html',
  styleUrls: ['./create-shipping-zone.component.scss'],
})
export class CreateShippingZoneComponent implements OnInit {
  // For Details
  zoneVisible = false;
  chooseProduct = 'all';
  zoneChoose = true;
  shippingMethod = [
    {
      name: 'General Method',
      value: 1,
    },
    {
      name: 'Sameday Method',
      value: 2,
    },
    {
      name: 'Nextday Method',
      value: 3,
    },
    {
      name: 'Own Pick Method',
      value: 4,
    },
  ];

  // Choose Category
  listOfCatOption: ProductType[] = [];
  listOfProOption: ProductType[] = [];
  selectedCatOptions = [];
  zila: Zila[];
  methods: ShippingMethod[] = [];
  showRate: boolean;

  constructor(
    private zilaService: ZilaService,
    private productTypeService: ProductTypeService,
    private shippingService: ShippingService,
  ) {}

  ngOnInit(): void {
    // Choose Category
    this.getAllCat();
    this.getAllZila();
    this.getAllShippingMethods();
  }

  // For Details
  showZoneModal(): void {
    this.zoneVisible = true;
  }
  zoneOk(): void {
    console.log('Button ok clicked!');
    this.zoneVisible = false;
  }
  zoneCancel(): void {
    console.log('Button cancel clicked!');
    this.zoneVisible = false;
  }
  onCancel(): void {
    console.log('Button cancel clicked!');
    this.showRate = false;
  }
  onOk(): void {
    console.log('Button ok clicked!');
    this.showRate = false;
  }

  getAllZila() {
    this.zilaService.getAllZila()
      .subscribe(res => {
        console.log(res);
        this.zila = res.data;
      }, error => {
        console.log(error);
      });
  }
  getAllCat() {
    this.productTypeService.getAll()
      .subscribe(res => {
        console.log(res);
        this.listOfCatOption = res.data;
      }, error => {
        console.log(error);
      });
  }
  getAllShippingMethods() {
    this.shippingService.getAll()
      .subscribe(res => {
        console.log(res.data);
        this.methods = res.data;
      }, error => {
        console.log(error);
      });
  }

  setRate(){
    this.showRate = true;
  }
}
