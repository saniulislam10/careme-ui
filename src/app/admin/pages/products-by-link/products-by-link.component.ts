import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder } from '@angular/forms';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ExportType } from 'src/app/enum/exportType.enum';
import { ProductStatus } from 'src/app/enum/product-status';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ExportPopupComponent } from '../products/export-popup/export-popup.component';
import * as XLSX from 'xlsx';
import { Pagination } from 'src/app/interfaces/pagination';

@Component({
  selector: 'app-products-by-link',
  templateUrl: './products-by-link.component.html',
  styleUrls: ['./products-by-link.component.scss']
})
export class ProductsByLinkComponent implements OnInit {

  // SEARCH AREA
  searchProducts: Product[]=[];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  searchQuery = null;

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('export') exportOrder:ExportPopupComponent;
  variantForm : FormGroup;
 // Subscriptions
 private subProduct: Subscription;
 private subCat: Subscription;
 private subSubCat: Subscription;
 private subAcRoute: Subscription;
 private subForm: Subscription;

 //Status
 productStatus: Select[] = [
   {value: ProductStatus.DRAFT, viewValue: 'Draft'},
   {value: ProductStatus.ACTIVE, viewValue: 'Active'},
   {value: ProductStatus.INACTIVE, viewValue: 'Inactive'},
   {value: ProductStatus.ARCHIVED, viewValue: 'Archived'},
   {value: ProductStatus.STOCKOUT, viewValue: 'Stock Out'},
   {value: ProductStatus.REORDER, viewValue: 'Re-Order'}
 ];
 // Pagination
 currentPage = 1;
 totalProducts = 0;
 productsPerPage = 6;
 totalProductsStore = 0;

 // productStatus

 status:number=0;

 // Store Data
 products: Product[] = [];
 private holdPrevData: any[] = [];

 //Enum
 public productEnum = ProductStatus;

 // sort
//  public sortQuery = {createdAt: -1};
 public sortQuery;
 public activeSort = null;
 showVariant = [false];
   // Selected Data
   selectedIds: string[] = [];
   @ViewChild('matCheckbox') matCheckbox: MatCheckbox;


 constructor(
   private activatedRoute: ActivatedRoute,
   private spinner: NgxSpinnerService,
   private reloadService: ReloadService,
   private productService: ProductService,
   private router: Router,
   private utilsService:UtilsService,
   private uiService:UiService,
   private fb:FormBuilder,
 ) { }

 ngOnInit(): void {
   this.showVariant[0] = false;
   this.initFormGroup();
   // GET PAGE FROM QUERY PARAM
   this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
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
   this.reloadService.refreshProduct$
     .subscribe(() => {
       this.getAllProducts();
     });
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
        if (this.searchQuery) {
          if (this.status === 0) {
            this.query = { hasLink: true };
          } else {
            this.query = { status: this.status };
            this.query = { ...this.query, ...{ hasLink: true } };
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
     case this.productEnum.DRAFT : {
       return 'draft';
     }
     case this.productEnum.ACTIVE : {
       return 'active';
     }
     case this.productEnum.INACTIVE : {
       return 'inactive';
     }
     case this.productEnum.ARCHIVED : {
       return 'archived';
     }
     case this.productEnum.STOCKOUT : {
       return 'stockout';
     }
     case this.productEnum.REORDER : {
       return 'reorder';
     }
     case this.productEnum.NONE : {
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
       const i = this.selectedIds.findIndex(f => f === id);
       this.selectedIds.splice(i, 1);
     }
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

   private checkSelectionData() {
     let isAllSelect = true;
     this.products.forEach(m => {
       if (!m.select) {
         isAllSelect = false;
       }
     });

     this.matCheckbox.checked = isAllSelect;
   }
   /*
   onStatusChange
   */
   onStatusChange(value, product, id:string){
     let array = product.variantFormArray;
     for(let i=0; i<product.variantFormArray.length; i++){
       array[i].variantStatus = value;
     }
     const data={
       _id:id,
       status:value,
       variantFormArray: array
     }
     this.productService.editProductById(data)
     .subscribe(res=>{
       this.uiService.success(res.message);
     })
   }
   onVariantStatusChange(value,index,variantFormArray,id:string){
     let array = variantFormArray;
     array[index].variantStatus = value
     const data={
       _id:id,
       variantFormArray: array
     }
     this.productService.editProductById(data)
     .subscribe(res=>{
       this.uiService.success(res.message);
     })
   }

   /**
    * Bulk Actions
    * */
    changeStatus(statusId:number) {
    let updatedList=[];
     this.selectedIds.forEach(element => {
         let data={
           _id:element,
           status:statusId
         }
         updatedList.push(data)
     });
     this.productService.updateMultipleProductById(updatedList)
     .subscribe(res=>{
       this.uiService.success(res.message);
       this.getAllProducts();
     })
   }
 /**
  * Filter Data
  */

//   onFilterSelectChange(data) {
//     this.status=data;
//    if (data) {
//      this.query = {status: data};
//      this.getAllProducts();
//    } else {
//      delete this.query;
//      this.getAllProducts();
//    }
//  }
onFilterSelectChange(data) {
  console.log(data);

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
    this.query = { ...this.query, ...{ hasLink: true } };
    console.log(this.query);
    this.getAllProducts();
  } else {
    delete this.query;
    this.getAllProducts();
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
   if (this.isOpen || this.isOpen && !this.isLoading) {
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
   this.router.navigate([], {queryParams: {page: event}});
 }

 /**
  * HTTP REQ
  */

  private getAllProducts() {
   this.spinner.show();

   const pagination: Pagination = {
     pageSize: this.productsPerPage.toString(),
     currentPage: this.currentPage.toString()
   };

   const select = '';

   if (this.query === '' || this.query === null || this.query === undefined) {
    this.query = { hasLink: true };
  }

   this.productService.getAddByLinkProductsByDynamicSort(pagination, this.sortQuery, this.query, select)
   .subscribe(res => {
     this.products = res.data;
       if (this.products && this.products.length) {
         this.products.forEach((m, i) => {
           const index = this.selectedIds.findIndex(f => f === m._id);
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

     }, error => {
       this.spinner.hide();
       console.log(error);
     });
 }

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
    .getAllArchivedProducts(pagination, this.sortQuery)
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

 //Product Delete
 deleteProduct(data){
  this.spinner.show();
  this.productService.deleteProductById(data._id).subscribe(
    (res) => {
      this.reloadService.needRefreshProduct$();
      this.uiService.success(res.message);
      this.spinner.hide();
    },
    (error) => {
      this.spinner.hide();
      this.uiService.warn('Error :');
    }
  );
}

 /**
  * Variant Show
  */
  variantDropDown(index){
    this.showVariant[index] = !this.showVariant[index];
  }

  /**
   * variant name
   */

   getVariantName(i, x, product){
     return product.variantDataArray[i][x];
   }


  /**** export pop up */
exportPopUpShow(){
 this.exportOrder.exportPOpUpShow();
}
  /**
  * EXPORTS TO EXCEL
  */
   exportToExcel(value){
     if(value.selectedAmount===ExportType.ALL_ORDERS){
       this.productService.getAllProducts(null)
       .subscribe(res=>{
         this.exportData(res.data,value.SelectedType)
       }, err => {
        console.log(err);
      })
       // exportToExcel(this.orders)
     }
     else if(value.selectedAmount === ExportType.CURRENT_PAGE){
       // this.getAllOrdersByAdmin()
       this.exportData(this.products,value.SelectedType)
     }
     else if(value.selectedAmount === ExportType.SELECTED){
       this.productService.getSelectedProductDetails(this.selectedIds)
       .subscribe(res=>{
         this.exportData(res.data,value.SelectedType)
       }, err => {
        console.log(err);

      })
     }
     else if(value.selectedAmount === ExportType.BY_SEARCH_RESULT){
         this.exportData(this.searchProducts,value.SelectedType)
     }
     else if(value.selectedAmount === ExportType.BY_DATE){

     }
   }
   exportData(orders,type){
     this.spinner.show();
     const date = this.utilsService.getDateString(new Date());
     // EXPORT XLSX
     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(orders);
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, 'Products');
     if(type==="2"){
     XLSX.writeFile(wb, `Products${date}.csv`);
     }else{
     XLSX.writeFile(wb, `Products${date}.xlsx`);
     }
     this.spinner.hide();
   }

 //thumbnail
 setThumbnailImage(data){
   let images = this.getImages(data.medias, data.images);
   return images[0];
 }

 getImages(medias, images){
   let allMedias = [];
   if(medias && medias.length > 0){
     for(let i =0, x=0;i<medias.length;i++){
       if(medias[i] !==null && medias[i] !==""){
         allMedias.push(medias[i]);
         x++;
       }
     }
     allMedias = [...allMedias, ...images];
   }else{
     allMedias = images;
   }
   return allMedias;
 }

 deleteBulkProducts() {
  let updatedList = [];
  this.selectedIds.forEach((element) => {
    let data = {
      _id: element,
    };
    updatedList.push(data);
  });
  for (let i = 0; i < updatedList.length; i++) {
    this.spinner.show();
    this.productService.deleteProductById(updatedList[i]._id).subscribe(
      (res) => {
        this.spinner.hide();
        console.log(res.message);
        this.getAllProducts();
      },
      (err) => {
        console.log(err);
        this.spinner.hide();
      }
    );
  }
  this.spinner.hide();
}


}
