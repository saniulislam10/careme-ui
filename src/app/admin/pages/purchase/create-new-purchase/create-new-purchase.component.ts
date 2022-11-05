import { RecievedComponent } from './../recieved/recieved.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Admin } from './../../../../interfaces/admin';
import { AdminService } from 'src/app/services/admin.service';
import { products } from 'src/app/core/utils/dashboard.data';
import { Purchase } from 'src/app/interfaces/purchase';
import { Pagination } from './../../../../interfaces/pagination';
import {
  pluck,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { Supplier } from 'src/app/interfaces/supplier';
import { PurchaseStatus } from 'src/app/enum/purchase-status';

@Component({
  selector: 'app-create-new-purchase',
  templateUrl: './create-new-purchase.component.html',
  styleUrls: ['./create-new-purchase.component.scss'],
})
export class CreateNewPurchaseComponent implements OnInit {
  public dataForm: FormGroup;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  overlay = false;
  isFocused = false;
  isOpen = false;
  isLoading = false;
  query = null;
  searchProducts: Product[] = [];
  clickActive: any[] = [[]];
  today = new Date();
  ponewVisible = true;
  notAllowed = false;
  status : number = 0;

  private subRouteOne?: Subscription;
  // purchasedProducts: any[] = [];
  public date = new Date();
  id: any;
  order: Order;
  DateToday: Date = new Date();
  canceledOrderSku: string;
  canceledOrderAmount: number;
  selectedIds: any[] = [];
  suppliers: Supplier[];
  filteredSupplierList: Supplier[];
  subTotal = 0;
  total = 0;
  products: FormArray;
  admin: Admin;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService,
    private router : Router,
    private adminService: AdminService,
    private msg : NzMessageService
  ) {}

  ngOnInit(): void {
    this.initFormValue();
    this.getSuppliers();
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getPurchaseInfo(this.id);
      }
    });
    this.getAdminInfo();
  }
  initFormValue() {
    this.dataForm = this.fb.group({
      reference: [null],
      dateTime: [this.today],
      supplier: [null, Validators.required],
      supplier_link: [null],
      manufacturer: [null],
      supplier_reference: [null],
      products: this.fb.array([]),
      adjustmentPrice: [0],
      purchaseShippingCharge: [0],
    });
    this.products = this.dataForm.get("products") as FormArray
  }

  getPurchaseInfo(id: any) {
    this.purchaseService.getById(id).subscribe(
      (res) => {
        this.dataForm.patchValue(res.data);
        this.status = res.data.status;
        let products = res.data.products;
        for (let i = 0; i < products.length; i++) {
          this.onSelectItem(products[i].productData, null, products[i]);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


  newProduct(data, index?: number, purchaseData?: any): FormGroup {
    console.log(data);
    if (purchaseData) {
      return this.fb.group({
        productData: data,
        sku: purchaseData.sku,
        purchaseQuantity: [purchaseData.purchaseQuantity, Validators.required],
        purchasePrice: [purchaseData.purchasePrice, Validators.required],
        purchaseTax: [purchaseData.purchaseTax, Validators.required],
        recieved: [purchaseData.recieved],
        amount: [purchaseData.amount],
      });
    } else if (index >= 0) {

      return this.fb.group({
        productData: data,
        sku: data.variantFormArray[index].variantSku,
        purchaseQuantity: [1, Validators.required],
        purchasePrice: [data.costPrice, Validators.required],
        purchaseTax: [0, Validators.required],
        recieved: [0],
        amount: [0],
      });
    } else {
      return this.fb.group({
        productData: data,
        sku: data.sku,
        purchaseQuantity: [1, Validators.required],
        purchasePrice: [data.costPrice, Validators.required],
        purchaseTax: [0, Validators.required],
        recieved: [0],
        amount: [0],
      });
    }
  }

  addProduct(data, index?: number, purchaseData?: any) {
    if (purchaseData) {
      this.products.push(this.newProduct(data, null, purchaseData));
    } else if (index >= 0) {
      this.products.push(this.newProduct(data, index));
    } else {
      this.products.push(this.newProduct(data));
    }
  }
  removeSkill(i: number) {
    this.products.removeAt(i);
  }

  // submit form
  onSubmit() {

    if (this.dataForm.invalid) {
      this.uiService.wrong('Please complete all the required fields');
      return;
    }
    if (this.dataForm.value.products.length === 0) {
      this.uiService.wrong('Please add products');
      return;
    }

    if(this.id){
      this.dataForm.value.products.forEach(element => {
        if(element.recieved > element.purchaseQuantity){
          this.msg.warning("Purchase Quantity can not be less than recieved quantity");
          this.notAllowed = true;
        }
      });
    }
    if(this.notAllowed){
      this.notAllowed = false;
      return
    }
    console.log("Purchase Status", this.dataForm.value);
    let data: Purchase = {
      reference: this.dataForm.value.reference,
      dateTime: this.dataForm.value.dateTime,
      supplier: this.dataForm.value.supplier,
      supplier_link: this.dataForm.value.supplier_link,
      manufacturer: this.dataForm.value.manufacturer,
      supplier_reference: this.dataForm.value.supplier_reference,
      products: this.dataForm.value.products,
      purchaseShippingCharge: this.dataForm.value.purchaseShippingCharge,
      status: this.status ? this.status : PurchaseStatus.DRAFT,
      recieved: 0,
      adjustmentPrice: this.dataForm.value.adjustmentPrice,
      comments: null,
      subTotal: this.total,
      totalAmount: this.calculateTotal() ? this.calculateTotal() : 0,
      admin: this.admin,
    };

    if (this.id) {
      const finalData = {
        ...data,
        ...{ _id: this.id },
      };
      this.editPurchase(finalData);
    } else {
      this.addPurchase(data);
    }
  }

  addPurchase(data) {
    this.purchaseService.add(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPurchase$();
        this.router.navigate(['admin/purchase']);
      },
      (err) => {

        this.uiService.wrong(err.message);
      }
    );
  }
  editPurchase(data) {
    this.purchaseService.edit(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPurchase$();
        this.router.navigate(['admin/purchase']);
      },
      (err) => {
        this.uiService.wrong(err.message);
      }
    );
  }
  delete(i) {
    this.products.removeAt(i);
  }
  calculateAmount(i) {
    let purchasePrice = this.products?.value[i]?.purchasePrice;
    let tax = (purchasePrice * this.products?.value[i]?.purchaseTax) / 100;
    let quantity = this.products?.value[i]?.purchaseQuantity;
    this.products.value[i].amount = Math.round((purchasePrice + tax) * quantity);
    return this.products.value[i].amount;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }

  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }
  handleOpen(): void {
    if (this.isOpen || (this.isOpen && !this.isLoading)) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  ngAfterViewInit(): void {
    // this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue
      .pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((data) => {
          console.log(data);
          this.query = data.trim();

          if (this.query === '' || this.query === null) {
            this.overlay = false;
            this.searchProducts = [];
            this.query = null;
            return EMPTY;
          }
          // this.isLoading = true;
          const pagination: Pagination = {
            currentPage: '1',
            pageSize: '10',
          };
          const filter = { productVisibility: true };
          return this.productService.getSearchProduct(
            this.query,
            pagination,
            filter
          );
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchProducts = res.data;
          if (this.searchProducts.length > 0) {
            this.isOpen = true;
            this.overlay = true;
          }
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  onSelectItem(data: Product, index?: number, purchaseData?: any): void {
    this.clickActive.push([]);
    console.log('Index : ', index);
    if (purchaseData) {
      this.addProduct(data, null, purchaseData);
    } else if (index >= 0) {
      this.addProduct(data, index);
    } else {
      this.addProduct(data);
    }
    this.clickActive.push([]);
    this.handleCloseAndClear();
  }
  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }

  getOptions(option) {
    let variantOptions = option.split(',');
    return variantOptions;
  }

  onSelectVariant(option) {
    // console.log(option);
  }

  setSku() {
    for (let i = 0; i < this.products.length; i++) {
      let sku = this.products[i].product.sku + '-';
      for (let x = 0; x < this.clickActive[i].length; x++) {
        sku += this.clickActive[i][x];
      }
      this.products[i].sku = sku;
    }
  }

  selectOption(data) {
    // console.log(data);
  }

  get calculateSubTotal() {
    let subTotal = 0;
    this.products.value.forEach(function (element) {
      subTotal += element.amount;
    });
    this.subTotal = subTotal;
    return this.subTotal;
  }

  calculateTotal() {
    let subTotal = this.subTotal;
    let shipping = this.dataForm.value.purchaseShippingCharge;
    let adjustment = this.dataForm.value.adjustmentPrice;
    this.total = subTotal + shipping + adjustment;
    return this.total;
  }

  // get vendors
  getSuppliers() {
    this.supplierService.getAll().subscribe(
      (res) => {
        this.suppliers = res.data;
        this.filteredSupplierList = this.suppliers.slice();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getAdminInfo(){
    this.adminService.getAdminShortData()
    .subscribe(res => {
      this.admin = res.data;
    }, err => {
      this.msg.error(err.message);
    })
  }

}
