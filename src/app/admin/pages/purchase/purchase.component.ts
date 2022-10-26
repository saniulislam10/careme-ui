import { NzMessageService } from 'ng-zorro-antd/message';
import { SupplierService } from './../../../services/supplier.service';
import { PurchaseService } from './../../../services/purchase.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import { ExportType } from 'src/app/enum/exportType.enum';
import { ProductStatus } from 'src/app/enum/product-status';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ExportPopupComponent } from '../stock/export-popup/export-popup.component';
import * as XLSX from 'xlsx';
import { CreateNewPurchaseComponent } from './create-new-purchase/create-new-purchase.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Purchase } from 'src/app/interfaces/purchase';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { Supplier } from 'src/app/interfaces/supplier';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent implements OnInit {
  tabs = ['All PO ', 'Draft', 'Issued', 'Closed', 'Canceled'];

  // Table Check
  allChecked = false;
  checkOptionsOne = false;

  // New PO Create
  ponewVisible = false;

  @ViewChild('export') exportStock: ExportPopupComponent;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  status: number = 0;
  // Pagination
  currentPage: number = 1;
  totalProducts: number;
  productsPerPage = 10;
  totalProductsStore = 0;
  query = null;
  public sortQuery;
  public activeSort = null;
  private holdPrevData: any[] = [];
  pagination: any;
  searchProducts: Product[] = [];
  purchases: Purchase[] = [];
  selectedIds: string[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  checked = false;
  indeterminate = false;
  public productEnum = ProductStatus;
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('productSearchForm') productSearchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('productSearchInput') productSearchInput: ElementRef;

  // Subscriptions
  private subProduct: Subscription;
  searchQuery: any;
  productSearchQuery: any;


  suppliers : Supplier[] = [];
  filteredSupplierList : Supplier[] = [];

  today = new Date();
  dataForm: FormGroup;

  id: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private supplierService: SupplierService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private router: Router,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private msg : NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.reloadService.refreshPurchase$.subscribe(() => {
      this.getAllPurchase();
      this.getSuppliers();
    });

    this.initModule();
    this.getSuppliers();
    this.getAllPurchase();
  }

  initModule() {
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

  getSuppliers() {
    this.supplierService.getAll().subscribe(
      (res) => {
        this.suppliers = res.data;
        this.filteredSupplierList = this.suppliers.slice();
        console.log(this.suppliers);
      },
      (err) => {
        this.msg.error(err.message);

      }
    );
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.msg.warning('Please complete all the required fields');
      return;
    }
    if (this.dataForm.value.products.length === 0) {
      this.msg.warning('Please add products');
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

  addPurchase(data) {
    this.purchaseService.add(data).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.reloadService.needRefreshPurchase$();
      },
      (err) => {
        this.msg.error(err.message);
      }
    );
  }
  editPurchase(data) {
    this.purchaseService.edit(data).subscribe(
      (res) => {
        this.msg.success(res.message);
        this.reloadService.needRefreshPurchase$();
      },
      (err) => {
        this.msg.error(err.message);
      }
    );
  }

  /**
   * HTTP REQ
   */

  private getAllPurchase() {
    this.spinner.show();

    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.productsPerPage.toString(),
    };

    this.pagination = pagination;

    this.subProduct = this.purchaseService
      .getAll(this.pagination, this.query, this.sortQuery)
      .subscribe(
        (res) => {
          this.purchases = res.data;
          this.holdPrevData = this.purchases;
          // if (this.products && this.products.length) {
          //   this.products.forEach((m, i) => {
          //     const index = this.selectedIds.findIndex((f) => f === m._id);
          //     this.products[i].select = index !== -1;
          //   });
          // this.checkSelectionData();
          //   this.holdPrevData = res.data;
          //   this.totalProducts = res.count;
          //   this.totalProductsStore = res.count;
          // }
          // this.totalProducts = res.count;
          // this.totalProductsStore = res.count;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  /**
   * Images
   */
  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  getVariantName(i, x, product, index) {
    if (index !== 0) {
      return '/' + product.variantDataArray[i][x];
    }
    return product.variantDataArray[i][x];
  }

  // private checkSelectionData() {
  //   let isAllSelect = true;
  //   this.products.forEach((m) => {
  //     if (!m.select) {
  //       isAllSelect = false;
  //     }
  //   });

  //   this.matCheckbox.checked = isAllSelect;
  // }

  /**** export pop up */
  exportPopUpShow() {
    this.exportStock.exportPOpUpShow();
  }

  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel(value) {
    if (value.selectedAmount === ExportType.ALL_STOCK) {
      this.purchaseService.getAll(null).subscribe((res) => {
        this.exportData(res.data, value.SelectedType);
      });
      // exportToExcel(this.orders)
    } else if (value.selectedAmount === ExportType.CURRENT_PAGE) {
      // this.getAllOrdersByAdmin()
      this.exportData(this.purchases, value.SelectedType);
    } else if (value.selectedAmount === ExportType.SELECTED) {
      //this.
      this.purchaseService.getAll(null).subscribe((res) => {
        this.exportData(res.data, value.SelectedType);
      });
    } else if (value.selectedAmount === ExportType.BY_SEARCH_RESULT) {
      this.exportData(this.searchProducts, value.SelectedType);
    } else if (value.selectedAmount === ExportType.BY_DATE) {
    }
  }

  exportData(data, type) {
    this.spinner.show();
    const date = this.utilsService.getDateString(new Date());
    // EXPORT XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'STOCK');
    if (type === '2') {
      XLSX.writeFile(wb, `STOCK${date}.csv`);
    } else {
      XLSX.writeFile(wb, `STOCK${date}.xlsx`);
    }
    this.spinner.hide();
  }

  // filtering
  onFilterSelectChange(data) {
    this.status = data;
    switch (data) {
      case 1:
        this.query = { status: data };
        break;
      case 2:
        this.query = { status: data };
        // code block
        break;
      case 3:
        this.query = { isPreOrder: true };
        // code block
        break;
      case 5:
        this.query = { isStockOut: true };
        // code block
        break;
      case 6:
        this.query = { isReOrder: true };
        // code block
        break;
      default:
      // code block
    }

    if (data) {
      this.query = { ...this.query, ...{ hasLink: false } };
      this.getAllPurchase();
    } else {
      delete this.query;
      this.getAllPurchase();
    }
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    if (this.searchQuery) {
      this.purchaseService
        .getBySearch(
          this.pagination,
          this.searchQuery,
          this.sortQuery,
          this.query
        )
        .subscribe(
          (res) => {
            this.purchases = res.data;
          },
          () => {
            this.isLoading = false;
          }
        );
    } else {
      this.getAllPurchase();
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.purchases.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.purchases.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.purchases.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }

  /*
   * Search
   */

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
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

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
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

  // dialog box functions
  openDialog() {
    const dialogRef = this.dialog.open(CreateNewPurchaseComponent, {
      restoreFocus: false,
      data: {
        order: {},
        canceledOrderSku: 'sku001',
        canceledOrderAmount: '100tk',
        selectedIds: this.selectedIds,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
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
          this.searchQuery = data.trim();

          console.log(this.searchQuery);

          if (this.searchQuery) {
            return this.purchaseService.getBySearch(
              this.pagination,
              this.searchQuery,
              this.sortQuery,
              this.query
            );
          } else {
            this.purchases = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.purchases = res.data;
        },
        () => {
          this.isLoading = false;
        }
      );

      const productFormValue = this.productSearchForm.valueChanges;

      productFormValue
        .pipe(
          // map(t => t.searchTerm)
          // filter(() => this.searchForm.valid),
          pluck('searchTermProducts'),
          debounceTime(200),
          distinctUntilChanged(),
          switchMap((data) => {
            this.query = data.trim();
            console.log(this.query);

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
            return this.productService.getSearchProduct(
              this.query,
              pagination,
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

  // New PO Open by Mamun
  showNewPurchase(): void {
    this.ponewVisible = true;
  }
  purchaseOk(): void {
    this.ponewVisible = false;
  }
  purchaseCancel(): void {
    this.ponewVisible = false;
  }
}
