import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  pluck,
  switchMap,
} from 'rxjs/operators';
import { ExportType } from 'src/app/enum/exportType.enum';
import { ProductStatus } from 'src/app/enum/product-status';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { AdminDataService } from 'src/app/services/admin-data.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as XLSX from 'xlsx';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  // SEARCH AREA
  searchProducts: Product[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  searchQuery = null;

  // Filter More
  visibleMore = false;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('export') exportOrder: ExportPopupComponent;
  variantForm: FormGroup;
  // Subscriptions
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  //Status
  productStatus: Select[] = [
    { label: 'Draft', value: ProductStatus.DRAFT },
    { label: 'Active', value: ProductStatus.ACTIVE },
  ];
  // Pagination
  currentPage: number = 1;
  totalProducts: number;
  productsPerPage = 10;
  totalProductsStore = 0;

  // productStatus

  status: number = 0;

  // Store Data
  products: Product[] = [];
  private holdPrevData: any[] = [];

  //Enum
  public productEnum = ProductStatus;

  // sort
  public sortQuery;
  public activeSort = null;
  showVariant = [false];
  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  checked: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<number>();
  expandSet = new Set<number>();
  tabs = [
    { value: 0, label: 'All Product' },
    { value: ProductStatus.DRAFT, label: 'Draft' },
    { value: ProductStatus.ACTIVE, label: 'Active' },
    { value: ProductStatus.PREORDER, label: 'Pre-Order' },
    { value: ProductStatus.STOCKOUT, label: 'Stock Out' },
    { value: ProductStatus.REORDER, label: 'Re Order' },
    { value: ProductStatus.ARCHIVED, label: 'Archieved' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private vendorService: AdminDataService,
    private productService: ProductService,
    private router: Router,
    private utilsService: UtilsService,
    private uiService: UiService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private msg: NzMessageService
  ) {}

  ngOnInit(): void {
    this.showVariant[0] = false;
    this.initFormGroup();

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam) => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }

      if (!this.searchProducts.length) {
        this.getAllProducts();
      }
    });

    // OBSERVABLE
    this.reloadService.refreshProduct$.subscribe(() => {
      this.getAllProducts();
    });
  }

  onRefresh() {
    this.isLoading = true;
    this.getAllProducts();
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.variantForm = this.fb.group({
      stock: [null],
      reOrder: [null],
    });
  }

  /* After View Init */
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
          const pagination: Pagination = {
            currentPage: this.currentPage.toString(),
            pageSize: this.productsPerPage.toString(),
          };
          this.searchQuery = data.trim();
          console.log(this.searchQuery);
          if (this.searchQuery) {
            if (this.status === 0) {
              this.query = { hasLink: false };
            } else {
              this.query = { status: this.status };
              this.query = { ...this.query, ...{ hasLink: false } };
            }
            if (this.status === 0) {
              return this.productService.getSearchProduct(
                this.searchQuery,
                pagination,
                this.query
              );
            } else {
              return this.productService.getSearchProduct(
                this.searchQuery,
                pagination,
                this.query
              );
            }
          } else {
            this.searchProducts = [];
            this.products = this.holdPrevData;
            this.totalProducts = this.totalProductsStore;
            this.searchProducts = [];
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.searchProducts = res.data;
          this.products = res.data;
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
  /**
   * NG CLASS
   */
  getStatusColor(status) {
    switch (status) {
      case this.productEnum.DRAFT: {
        return 'draft';
      }
      case this.productEnum.ACTIVE: {
        return 'active';
      }
      case this.productEnum.PREORDER: {
        return 'preorder';
      }
      case this.productEnum.ARCHIVED: {
        return 'archived';
      }
      case this.productEnum.STOCKOUT: {
        return 'stockout';
      }
      case this.productEnum.REORDER: {
        return 'reorder';
      }
      case this.productEnum.NONE: {
        return 'none';
      }
      default: {
        return '-';
      }
    }
  }
  /**
   * ON Select Check
   */

  onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex((f) => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    this.checked = !this.checked;
    const currentPageIds = this.products.map((m) => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(
        this.selectedIds,
        currentPageIds
      );
      this.products.forEach((m) => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach((m) => {
        this.products.find((f) => f._id === m).select = false;
        const i = this.selectedIds.findIndex((f) => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }

  private checkSelectionData() {
    let isAllSelect = true;
    this.products.forEach((m) => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.checked = isAllSelect;
  }
  /*
    onStatusChange
    */
  onStatusChange(value, product, id: string) {
    console.log(value);
    let array = product.variantFormArray;
    for (let i = 0; i < product.variantFormArray.length; i++) {
      array[i].variantStatus = value;
    }
    const data = {
      _id: id,
      status: value,
      variantFormArray: array,
    };
    this.productService.editProductById(data).subscribe((res) => {
      this.uiService.success(res.message);
    });
  }
  onVariantStatusChange(value, index, variantFormArray, id: string) {
    let array = variantFormArray;
    array[index].variantStatus = value;
    const data = {
      _id: id,
      variantFormArray: array,
    };
    this.productService.editProductById(data).subscribe((res) => {
      this.uiService.success(res.message);
    });
  }

  /**
   * Bulk Actions
   * */
  changeStatus(statusId: number) {
    let updatedList = [];
    this.selectedIds.forEach((element) => {
      let data = {
        _id: element,
        status: statusId,
      };
      updatedList.push(data);
    });
    this.productService
      .updateMultipleProductById(updatedList)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.getAllProducts();
      });
  }
  /**
   * Filter Data
   */

  onFilterSelectChange(data) {
    this.status = data;
    switch (data) {
      case ProductStatus.DRAFT:
        this.query = { status: data };
        break;
      case ProductStatus.ACTIVE:
        this.query = { status: data };
        // code block
        break;
      case ProductStatus.PREORDER:
        this.query = { isPreOrder: true };
        // code block
        break;
      case ProductStatus.STOCKOUT:
        this.query = { isStockOut: true };
        // code block
        break;
      case ProductStatus.REORDER:
        this.query = { isReOrder: true };
        // code block
        break;
      case ProductStatus.ARCHIVED:
        delete this.query;
        break;
      default:
      // code block
    }

    if (data === ProductStatus.ARCHIVED) {
      this.getAllArchivedProducts();
    } else if (data) {
      this.query = { ...this.query, ...{ hasLink: false } };
      this.reloadService.needRefreshProduct$();
    } else {
      delete this.query;
      this.reloadService.needRefreshProduct$();
    }
  }

  /**
   * SORTING
   */
  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllProducts();
  }

  /**
   * SEARCHING
   */

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
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

  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    // this.addToUserCart(data);
  }
  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }

  /**
   * HTTP REQ
   */

  private getAllProducts() {
    this.spinner.show();

    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.productsPerPage.toString(),
    };

    const select = '';

    if (this.query === '' || this.query === null || this.query === undefined) {
      this.query = { hasLink: false };
    }

    this.subProduct = this.productService
      .getProductsByDynamicSort(pagination, this.sortQuery, this.query, select)
      .subscribe(
        (res) => {
          this.products = res.data;
          console.log('Products', this.products);
          if (this.products && this.products.length) {
            this.products.forEach((m, i) => {
              const index = this.selectedIds.findIndex((f) => f === m._id);
              this.products[i].select = index !== -1;
            });
            this.checkSelectionData();
            this.holdPrevData = res.data;
            this.totalProducts = res.count;
            this.totalProductsStore = res.count;
          }
          this.totalProducts = res.count;
          this.totalProductsStore = res.count;
          this.spinner.hide();
          this.isLoading = false;
        },
        (error) => {
          this.spinner.hide();
          this.isLoading = false;
          console.log(error);
        }
      );
  }

  getAllArchivedProducts() {
    this.spinner.show();
    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.productsPerPage.toString(),
    };
    this.productService.getAllArchivedProducts(pagination).subscribe(
      (res) => {
        this.products = res.data;
        this.spinner.hide();
      },
      (err) => {
        this.msg.error(err.message);
        this.spinner.hide();
      }
    );
  }

  /**
   * Variant Show
   */
  variantDropDown(index) {
    this.showVariant[index] = !this.showVariant[index];
  }

  onExpandChange(id: number, checked: boolean): void {
    console.log('For Variant :', id);
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  /**
   * variant name
   */

  getVariantName(i, x, product) {
    return product.variantDataArray[i][x];
  }

  /**** export pop up */
  exportPopUpShow() {
    this.exportOrder.exportPOpUpShow();
  }
  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel(value) {
    if (value.selectedAmount === ExportType.ALL_ORDERS) {
      this.productService.getAllProducts(null).subscribe((res) => {
        this.exportData(res.data, value.SelectedType);
      });
      // exportToExcel(this.orders)
    } else if (value.selectedAmount === ExportType.CURRENT_PAGE) {
      // this.getAllOrdersByAdmin()
      this.exportData(this.products, value.SelectedType);
    } else if (value.selectedAmount === ExportType.SELECTED) {
      //this.
      this.productService
        .getSelectedProductDetails(this.selectedIds)
        .subscribe((res) => {
          this.exportData(res.data, value.SelectedType);
        });
    } else if (value.selectedAmount === ExportType.BY_SEARCH_RESULT) {
      this.exportData(this.searchProducts, value.SelectedType);
    } else if (value.selectedAmount === ExportType.BY_DATE) {
    }
  }
  exportData(orders, type) {
    this.spinner.show();
    const date = this.utilsService.getDateString(new Date());
    // EXPORT XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orders);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    if (type === '2') {
      XLSX.writeFile(wb, `Products${date}.csv`);
    } else {
      XLSX.writeFile(wb, `Products${date}.xlsx`);
    }
    this.spinner.hide();
  }

  //thumbnail
  setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  deleteBulkProducts() {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent:
        '<b style="color: red;">All the related datas will be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.onDelete();
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });

    this.spinner.hide();
  }

  onDelete() {
    console.log(this.selectedIds);
    this.productService.deleteManyProducts(this.selectedIds).subscribe(
      (res) => {
        this.spinner.hide();
        this.msg.success(res.message);
        this.reloadService.needRefreshProduct$();
      },
      (err) => {
        this.msg.error(err.message);
        this.spinner.hide();
        this.reloadService.needRefreshProduct$();
      }
    );
  }

  //variant status
  getVariantStatus(variant: any) {
    if (
      variant?.variantContinueSelling === true &&
      variant?.variantQuantity === 0
    ) {
      return 'Pre-Order';
    } else if (variant?.variantQuantity === 0) {
      return 'Stock-Out';
    } else {
      return 'Active';
    }
  }

  getVariantStatusColor(variant: any) {
    if (
      variant?.variantContinueSelling === true &&
      variant?.variantQuantity === 0
    ) {
      return 'orange status';
    } else if (variant?.variantQuantity === 0) {
      return 'red status';
    } else {
      return 'green status';
    }
  }

  // Filter More
  openMore(): void {
    this.visibleMore = true;
  }
  closeMore(): void {
    this.visibleMore = false;
  }
}
