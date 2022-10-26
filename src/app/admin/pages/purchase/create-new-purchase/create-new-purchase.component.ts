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
import { ActivatedRoute } from '@angular/router';
import { SupplierService } from 'src/app/services/supplier.service';
import { Supplier } from 'src/app/interfaces/supplier';

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

  private subRouteOne?: Subscription;
  // purchasedProducts: any[] = [];
  public date = new Date();
  createInvoice = false;
  id: any;
  order: Order;
  DateToday: Date = new Date();
  canceledOrderSku: string;
  canceledOrderAmount: number;
  selectedIds: any[] = [];
  suppliers: Supplier[];
  filteredSupplierList: Supplier[];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private purchaseService: PurchaseService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
    private supplierService: SupplierService
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
  }

  getPurchaseInfo(id: any) {
    this.purchaseService.getById(id).subscribe(
      (res) => {
        this.dataForm.patchValue(res.data);
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

  get products(): FormArray {
    return this.dataForm.get('products') as FormArray;
  }

  newProduct(data, index?: number, purchaseData?: any): FormGroup {
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

    let data: Purchase = {
      reference: this.dataForm.value.reference,
      dateTime: this.dataForm.value.dateTime,
      supplier: this.dataForm.value.supplier,
      supplier_link: this.dataForm.value.supplier_link,
      manufacturer: this.dataForm.value.manufacturer,
      supplier_reference: this.dataForm.value.supplier_reference,
      products: this.dataForm.value.products,
      purchaseShippingCharge: this.dataForm.value.purchaseShippingCharge,
      status: 0,
      recieved: 0,
      adjustmentPrice: this.dataForm.value.adjustmentPrice,
      comments: null,
      subTotal: this.calculateSubTotal() ? this.calculateSubTotal() : 0,
      totalAmount: this.calculateTotal() ? this.calculateTotal() : 0,
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
      },
      (err) => {
        this.uiService.wrong(err.message);
      }
    );
  }

  //close dialog box
  close() {
    // console.log("close");
  }
  delete(i) {
    // console.log("delete");
    this.products.removeAt(i);
  }

  calculateAmount(i) {
    let purchasePrice = this.products?.value[i]?.purchasePrice;
    let tax = Math.round(
      (purchasePrice * this.products?.value[i]?.purchaseTax) / 100
    );
    let quantity = this.products?.value[i]?.purchaseQuantity;
    this.products.value[i].amount = (purchasePrice + tax) * quantity;
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

  calculateSubTotal() {
    let total = 0;
    this.products.value.forEach(function (element) {
      total += element.amount;
    });
    return total;
  }

  calculateTotal() {
    let subTotal = this.calculateSubTotal();
    let shipping = this.dataForm.value.purchaseShippingCharge;
    let adjustment = this.dataForm.value.adjustmentPrice;
    let total = subTotal + shipping + adjustment;
    return total;
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

  // New PO Open by Mamun
  showNewPurchase(): void {
    this.ponewVisible = true;
  }
  purchaseCancel(): void {
    this.ponewVisible = false;
    
  }
}
