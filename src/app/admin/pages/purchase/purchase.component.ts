import { PurchaseService } from './../../../services/purchase.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
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

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

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
  searchProducts: Product[] = [];
  purchases: Purchase[] = [];
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private reloadService: ReloadService,
    private purchaseService: PurchaseService,
    private router: Router,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private uiService: UiService
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshPurchase$
      .subscribe(() => {
        this.getAllPurchase();
      });

      this.getAllPurchase();
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

    const select = '';

    if (this.query === '' || this.query === null || this.query === undefined) {
      this.query = { hasLink: false };
    }

    this.subProduct = this.purchaseService.getAll(pagination, this.query)
      .subscribe(
        (res) => {
          this.purchases = res.data;
          console.log('Products', this.purchases);
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
    let images = this.getImages(data.medias, data.images);
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
    if(index !== 0){
      return "/"+product.variantDataArray[i][x];
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
      this.purchaseService
        .getAll(null)
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
    this.getAllPurchase();
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
        canceledOrderSku: "sku001",
        canceledOrderAmount: "100tk",
        selectedIds: this.selectedIds,
      },
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
}

}
