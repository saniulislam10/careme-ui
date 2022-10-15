import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UtilsService } from 'src/app/services/utils.service';
import { PricePipe } from 'src/app/shared/pipes/price.pipe';

@Component({
  selector: 'app-create-order-dialog',
  templateUrl: './create-order-dialog.component.html',
  styleUrls: ['./create-order-dialog.component.scss'],
  providers: [PricePipe]
})
export class CreateOrderDialogComponent implements OnInit {

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchFormUser') searchFormUser: NgForm;
  overlay = false;
  isFocused = false;
  isOpen = false;
  isLoading = false;
  query = null;
  searchProducts: Product[] = [];
  products: any[] = [];
  clickActive: any[] = [[]];
  createOrder = false;
  total: number = 0;
  // User SEARCH AREA
  searchUsers: User[] = [];
  isUserFocused = false;
  isUserOpen = false;
  isUserLoading = false;
  userOverlay = false;
  users: User[] = [];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private router: Router,
    private orderService: OrderService,
    private productService: ProductService,
    private adminService:AdminService,
    private pricePipe: PricePipe,
    private userDataService:UserDataService,
    ) { }

  ngOnInit(): void {
  }

    /**** create Order Toggle */
    createOrderShow(){
      this.createOrder = true;
    }
    createOrderHide(){
      this.createOrder = false;
    }

    //search
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



        // this.searchAnim();
      const userValue = this.searchFormUser.valueChanges;

      userValue.pipe(
        // map(t => t.searchTerm)
        // filter(() => this.searchForm.valid),
        pluck('searchUserTerm'),
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(data => {
          this.query = data.trim();
          if (this.query === '' || this.query === null) {
            this.userOverlay = false;
            this.searchUsers = [];
            this.query = null;
            return EMPTY;
          }
          this.isLoading = true;
          const pagination: Pagination = {
            currentPage: '1',
            pageSize: '10'
          };

          const filter = {productVisibility: true};
          console.log(data);
          return this.userDataService.getSearchUsers(data, pagination, filter);
        })
      )
        .subscribe(res => {
          this.isUserLoading = false;
          this.users = res.data;
          this.searchUsers=res.data;
          if (this.searchUsers.length > 0) {
            this.isUserOpen = true;
            this.userOverlay = true;
          }
        }, () => {
          this.isUserLoading = false;
        });
    }
    onSelectItem(data: Product): void {
      console.log("Selected Product Data",data);
      let product = {
        orderType: 'regular',
        price: data.sellingPrice,
        product: {
          images: data.images,
          medias: data.medias,
          name: data.name,
          options: data.options,
          sellingPrice: data.sellingPrice,
          sku: data.sku,
          slug: data.slug,
          status: data.status,
          variantDataArray: data.variantDataArray,
          variantFormArray: data.variantFormArray,
          variants: data.variants,
          vendor: data.vendor,
          _id: data._id,
        },
        maxQuantity: data.quantity,
        quantity: data?.quantity,
        sku: data.sku,
        status: 0,
        tax: data.hasTax ? data.tax : 0,
        partialPaymentType: data.partialPaymentType,
        partialPayment: data.partialPayment,
      };
      this.products.push(product);
      console.log("products", this.products);

      this.clickActive.push([]);
      this.handleCloseAndClear();
    }


    setThumbnailImage(data) {
      let images = this.productService.getImages(data.medias, data.images);
      return images[0];
    }

    getOptions(option){
      return option.split(',');
    }
    setSku(){
      for(let i=0; i<this.products.length; i++){
        let sku = this.products[i].product.sku + "-";
        for(let x=0;x<this.clickActive[i].length;x++){
          sku += this.clickActive[i][x];
        }
        this.products[i].sku = sku;
      }
    }

    onSelectVariant(sku, name, index,row,col){
      this.clickActive[index][row]=col;
      this.setSku();
      let pSku = this.products[index].sku;
      console.log(pSku);
      // console.log('this.products[index].product.variantFormArray', this.products[index].product.variantFormArray);

      let variant = this.products[index].product.variantFormArray.find(function (el) {
        return el.variantSku === pSku
      });
      console.log("variant",variant);

      this.products[index].price = variant.variantPrice;
      this.products[index].quantity = variant.variantQuantity;
      this.products[index].maxQuantity = variant.variantQuantity;

      // console.log("this.products[index].quantity", this.products[index].quantity);



    }

 getAmount(item){
    return Math.round((item?.price* item?.quantity + item.tax* item?.quantity) )
  }
  cartSubTotalForTotal(product, quantity, variantPrice?): number {
    return this.pricePipe.transform(product as Product, 'priceWithTax', quantity, variantPrice) as number;
  }


  // cartSubTotal(){
  //   this.total = 0;
  //   for(let i=0; i< this.products?.length; i++){
  //     if(this.products[i].variant.length > 0){
  //       this.total += this.cartSubTotalForTotal(this.products[i].product, this.products[i].selectedQty, this.products[i].variant[0].variantPrice);
  //     }else{
  //       this.total += this.cartSubTotalForTotal(this.products[i].product, this.products[i].selectedQty );
  //     }
  //   }
  //   return this.total;
  // }

  //coustomer serarch

  onClickSearchAreaUser(event: MouseEvent): void {
    event.stopPropagation();
  }


  handleUserFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isUserFocused) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.setUserPanelState(event);
    }
    this.isUserFocused = true;
  }

  private setUserPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isUserOpen = false;
    this.handleUserOpen();
  }

  handleUserOpen(): void {
    if (this.isUserOpen || this.isUserOpen && !this.isUserLoading) {
      return;
    }
    if (this.searchUsers.length > 0) {
      this.isUserOpen = true;
      this.userOverlay = true;
    }
  }

  handleUserCloseAndClear(): void {
    if (!this.isUserOpen) {
      this.isUserFocused = false;
      return;
    }
    this.isUserOpen = false;
    this.userOverlay = false;
    this.searchUsers = [];
    this.isUserFocused = false;
  }

  onSelectUser(data: Product): void {
    this.handleUserCloseAndClear();
    // this.router.navigate(['/product-details', data?.productSlug]);
    // this.router.navigate(['/', data?.brandSlug, data?.categorySlug, data?.productSlug]);
  }


   /**
   * QUANTITY CONTROL
   */

    incrementQty(i:number){
      // const sku = data?.sku;

      // const variantSku = this.holdProducts[i].product.variantFormArray.find((elem: any) => {
      //   return sku === elem?.variantSku;
      // })
      // console.log('products', this.products);
      // console.log('data', data);
      console.log("index", i);


      const item = this.products[i];
      if(item.quantity === item.maxQuantity){
        this.uiService.warn('Maximum Quantity is selected');
      } else {
        this.products[i].quantity += 1;
      }


      // if (variantSku?.variantQuantity) {
      //   this.products[i].quantity += 1;
      //   data?.product?.variantFormArray.forEach((elem: any, i: number) => {
      //     // return sku === elem?.variantSku;
      //     if(sku === elem?.variantSku){
      //      elem.variantQuantity -= 1
      //     }

      //   });
      //   console.log('this.products[i].quantity', this.products[i].quantity);
      // } else {
      //   this.uiService.warn('Maximum Quantity is selected');
      //   return;
      // }
    }

    decrementQty(i){
      if (this.products[i].quantity === 1) {
        this.uiService.warn('Minimum Quantity is selected');
        return;
      }
      this.products[i].quantity -= 1;

    }
}
