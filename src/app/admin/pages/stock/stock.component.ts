import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import { ExportType } from 'src/app/enum/exportType.enum';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ExportPopupComponent } from './export-popup/export-popup.component';
import * as XLSX from 'xlsx';
import { ProductStatus } from 'src/app/enum/product-status';
import { debounceTime, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  tabs = [
    'All Stock',
    'Instock',
    'Committed',
    'Available',
    'Low Stock',
    'Pre-Order',
    'Archived',
  ];

  @ViewChild('export') exportStock: ExportPopupComponent;
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
  searchProducts: Product[] = [];
  products: Product[] = [];
  selectedIds: string[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  public productEnum = ProductStatus;
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Subscriptions
  private subProduct: Subscription;
  searchQuery: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private productService: ProductService,
    private router: Router,
    private utilsService: UtilsService,
    private uiService: UiService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  onRefresh(){
    this.isLoading = true;
    this.getAllProducts();
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

  /**
   * Images
   */
   setThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias && medias.length > 0) {
      for (let i = 0, x = 0; i < medias.length; i++) {
        if (medias[i] !== null && medias[i] !== '') {
          allMedias.push(medias[i]);
          x++;
        }
      }
      allMedias = [...allMedias, ...images];
    } else {
      allMedias = images;
    }
    return allMedias;
  }

  getVariantName(i, x, product, index) {
    if (index !== 0) {
      return '/' + product.variantDataArray[i][x];
    }
    return product.variantDataArray[i][x];
  }

  private checkSelectionData() {
    let isAllSelect = true;
    this.products.forEach((m) => {
      if (!m.select) {
        isAllSelect = false;
      }
    });

    this.matCheckbox.checked = isAllSelect;
  }

  /**** export pop up */
  exportPopUpShow() {
    this.exportStock.exportPOpUpShow();
  }

  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel(value) {
    if (value.selectedAmount === ExportType.ALL_STOCK) {
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
        this.query = { quantity: { $gt: 0 } };
        break;
      case 2:
        this.query = { committedQuantity: { $gt: 0 } };
        // code block
        break;
      case 3:
        this.query = { quantity: { $gt: 0 } };
        // code block
        break;
      case 4:
        this.query = { quantity: { $lte: 2 } };
        // code block
        break;
      case 5:
        this.query = { continueSelling: true };
        // code block
        break;
      case 6:
        this.getAllArchivedProducts(6);
        // code block
        break;
      default:
      // code block
    }

    if (data) {
      this.query = { ...this.query, ...{ hasLink: false } };
      this.getAllProducts();
    } else {
      delete this.query;
      this.getAllProducts();
    }
  }

  // filtering
  getAllArchivedProducts(data) {
    this.spinner.show();
    this.status = data;

    const pagination: Pagination = {
      currentPage: this.currentPage.toString(),
      pageSize: this.productsPerPage.toString(),
    };

    const select = '';

    if (this.query === '' || this.query === null || this.query === undefined) {
      this.query = { hasLink: false };
    }
    this.productService
      .getAllArchivedProducts(pagination)
      .subscribe(
        (res) => {
          this.products = res.data;
          console.log('archived', this.products);
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllProducts();
  }

  onAllSelectChange(event: MatCheckboxChange) {
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
}
