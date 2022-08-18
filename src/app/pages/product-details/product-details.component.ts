import { Cart } from './../../interfaces/cart';
import { BuyNowForNewUserComponent } from './buy-now-for-new-user/buy-now-for-new-user.component';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';
import { CartService } from 'src/app/services/cart.service';
import { CarouselCntrlService } from 'src/app/services/carousel-cntrl.service';
import { ProductService } from 'src/app/services/product.service';
import { AddToCartPopupComponent } from './add-to-cart-popup/add-to-cart-popup.component';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { SizeChartService } from 'src/app/services/size-chart.service';
import { SizeChart } from 'src/app/interfaces/size-chart';
import { NgxSpinnerService } from 'ngx-spinner';
import { StockControlService } from 'src/app/services/stock-control.service';
import { ProductStatus } from 'src/app/enum/product-status';
import { ProductStatusPipe } from 'src/app/shared/pipes/product-status.pipe';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from 'src/app/services/search.service';
import { User } from 'src/app/interfaces/user';
import { AngularEmbedVideoService } from 'angular-embed-video';
import { RegistrationDialogComponent } from '../../shared/dialog-view/registration-dialog/registration-dialog.component';
import { UserStatus } from '../../enum/user-status';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [ProductStatusPipe],
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('addToCartPup') addToCart: AddToCartPopupComponent;
  @ViewChild('newUser') newUser: BuyNowForNewUserComponent;
  @ViewChild('vid') vid!: ElementRef;

  // button active

  clickActive: boolean[][] = [[]];
  star = 4.3;
  btnActive = false;
  selectedQty = 1;
  variantSku: string = '';
  selectedVariantData: any;
  sku = [];
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;
  variantOptions = [];
  slug: any;
  product: any = null;
  public image: any;
  sizeChart: SizeChart[] = [];
  images: any[] = [];
  stockMessage: any;
  data: any;
  user: User;
  video: string;
  iframe_html: any;
  youtubeUrl = 'https://www.youtube.com/watch?v=iHhcHTlGtRs';
  websiteBaseLink: string;
  searchProduct: any;
  globalQuantity: number;
  deliveryDateFrom: any;
  deliveryDateTo: any;

  details = true;
  review = false;
  shipping = false;
  addToCartButton: boolean = true;
  globalPrice: any;
  clickVariant: boolean;

  carts: Cart[] = [];
  existInCart: boolean = false;
  globalContinue: boolean;

  selectedRow:number
  selectedColumn:number
  selectedVarientName: string
  isUserAuth: boolean;



  constructor(
    private carouselCntrService: CarouselCntrlService,
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private userDataService: UserDataService,
    private uiService: UiService,
    private sizeChartService: SizeChartService,
    private spinner: NgxSpinnerService,
    private stockControlService: StockControlService,
    private productStatusPipe: ProductStatusPipe,
    private dialog: MatDialog,
    private searchService: SearchService,
    private embedService: AngularEmbedVideoService,
    private utilsService : UtilsService
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');

      if (this.slug) {
        this.getSingleProductBySlug();
      } else {
        this.data = this.searchService.getSearchProduct();
        this.product = this.data;
        console.log("product", this.product);

      }
    });

    // this.getStockControl();
    this.reloadService.refreshUser$
    .subscribe(()=>{
      this.isUserAuth = this.userService.getUserStatus();
      // this.checkCartItems();
      this.getUser();
      this.getCartItemList();
    })
    this.reloadService.refreshCart$
    .subscribe(()=>{
      this.getCartItemList();
    })
    this.isUserAuth = this.userService.getUserStatus();
    this.getUser();
    this.getCartItemList();

  }

  dateCalculationFrom(data: any){
    const d = new Date();
    this.deliveryDateFrom = new Date(d.setDate(d.getDate() + data));
    return this.deliveryDateFrom
  }
  dateCalculationTo(data: any){
    const d = new Date();
    this.deliveryDateTo = new Date(d.setDate(d.getDate() + data));
    return this.deliveryDateTo
  }




  private getUser() {
    this.userDataService.getLoggedInUserInfo().subscribe(
      (res) => {
        console.log(res.data);
        this.user = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   * Http Req
   */

  // getStockControl() {
  //   this.stockControlService.getAllStockControl().subscribe(
  //     (res) => {
  //       if (this.product?.quantity >= 1) {
  //         this.stockMessage = res.data.greaterThanZero;
  //       } else if (this.product?.quantity === 0) {
  //         this.stockMessage = res.data.zero;
  //       } else {
  //         this.stockMessage = res.data.lessThanZero;
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }

  // get single product by slug
  private getSingleProductBySlug() {
    this.spinner.show();
    console.log(this.slug);

    this.subDataOne = this.productService
      .getSingleProductBySlug(this.slug)
      .subscribe(
        (res) => {
          console.log(res);

          if (
            res.data.status === ProductStatus.ACTIVE ||
            res.data.status === ProductStatus.STOCKOUT ||
            res.data.status === ProductStatus.REORDER
          ) {
            this.spinner.hide();
            this.product = res.data;
            this.globalContinue = this.product.continueSelling;
            this.globalQuantity = this.product.quantity;
            console.log("this.globalContinue",this.globalContinue);

            // if(this.product.link){
            //   this.searchByWebsite(this.product.link);;
            // }
            this.images = this.getImages(
              this.product.medias,
              this.product.images
            );
            this.image = this.images[0];
            this.data = res.data;
            this.globalPrice = this.product.sellingPrice;
            // this.setVideos();
            this.setDataForProduct();
          } else {
            this.spinner.hide();
            let status = this.productStatusPipe.transform(res.data.status);
            this.uiService.warn('This product is currently ' + status);
          }
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }

  setVideos() {
    this.iframe_html = this.embedService.embed(this.product.medias[2]);
    return this.video;
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias.length > 0) {
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

  // get size chart for the product
  getSizeChart() {
    let parent = this.product.parentCategory;
    this.sizeChartService
      .getSizeChartByParentCategoryId(parent)
      .subscribe((res) => {
        this.sizeChart = res.data;
      });
  }

  checkCartItems(selectedvarient?) {
    if(this.isUserAuth){
      for (const data of this.carts) {

        if (this.product._id === data.product?._id) {
          if (this.product.hasVariant === true) {
            if (selectedvarient.variantSku === data.variant[0]?.variantSku) {
              return true;
            }
          } else {
            return  true;
          }
        }
      }
    }else{
      return false;
    }
  }

  checkCartItemsWithoutVariant() {
    for (const data of this.carts) {
      if (this.product._id === data.product?._id) {
        if (this.product.hasVariant !== true) {
          this.existInCart = true;
        }
      }
    }
  }


  //cart length
  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data;
        this.checkCartItemsWithoutVariant();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /** http req ends */

  /**
   * Product Info
   */

  setDataForProduct() {
    if (this.product) {
      if (this.product.hasVariant === true) {
        this.variantSplit();
        this.variantSku = this.product.sku;
        // let skuId = this.product.variantFormArray[0].variantSku;
        // this.getVariantInfo(skuId);
      }
      this.getSizeChart();
      this.initializeArrays();
      if (this.images.length > 0) {
        this.image = this.images[0];
      }
    }
  }

  /**
   * CART FUNCTIONALITY
   */

  addToCarts() {
    console.log(this.selectedVariantData);

    const data: Cart = {
      product: this.product?._id,
      selectedQty: this.selectedQty,
      variant: this.selectedVariantData,
      selectedGlobalVariants: this.globalQuantity ? this.globalQuantity : null,
      deliveryDateFrom: this.deliveryDateFrom,
      deliveryDateTo : this.deliveryDateTo,
    };
    console.log("add to cart----------", data);

    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }

  addItemToCartDB(data: Cart) {
    this.userDataService.addItemToUserCart(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // add to cart button
  activeCartBtn() {

    if (!this.isUserAuth) {
      console.log("login first", this.isUserAuth);
      this.openRegistrationDialog();
      return
    }
    this.cartService.getCartItemType()
    .subscribe(res => {
      let type = res.data;
      if(type === 'request'){
        this.uiService.warn("Cannot add both regular and request product together in cart");
        return
      }else{
        if (this.product?.hasVariant === true) {
          if (this.clickVariant === true) {
              this.addToCarts();
              this.openCartDialog();
          } else {
            this.uiService.warn('Please choose a variant first');
          }
        } else {
          if (this.isUserAuth) {
            // this.btnActive = true;
            this.addToCarts();
            this.openCartDialog();
          } else {
            this.openRegistrationDialog();
          }
        }
      }
    }
    )

    // this.addToCart.showPopUp();
  }

  openCartDialog() {
    const dialogRef = this.dialog.open(AddToCartPopupComponent, {
      data: {
        name: this.product.name,
        selectedQty: this.selectedQty,
        price: this.selectedVariantData
          ? this.selectedVariantData.variantPrice
          : this.product.sellingPrice,
        image: this.product.images[0],
      },
      // width: '100%',
      // height: '100%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.selectedVariant(this.selectedRow,this.selectedColumn)

      // console.clear()
      // console.log("relaoadd")

    });

  }


  // buy now button
  activeBookBtn() {
    this.btnActive = false;
    this.newUser.newUserPopUpShow();
  }

  /**
   * Variant Functions
   */

  variantSplit() {
    for (let i = 0; i < this.product.options.length; i++) {
      this.variantOptions[i] = this.product.options[i].split(',');
    }
  }

  selectedVariant(row, col) {

    this.selectedRow = row;
    this.selectedColumn = col;



    this.clickActive[row] = [];
    this.clickActive[row][col] = !this.clickActive[row][col];

    // this.sku[i] = variantName.charAt(0) + index;
    this.sku[row] = col;

    this.variantSku = this.product.sku + '-';
    for (let y = 0; y < this.product.variants.length; y++) {
      this.variantSku += this.sku[y];
    }
    this.getVariantInfo(this.variantSku);

    console.log(this.globalQuantity);

    if (this.selectedQty > this.globalQuantity && this.globalQuantity !== 0) {
      this.addToCartButton = false;
      this.uiService.warn(
        'Your selected quantity is more than in stock quantity, Please select less.'
      );
    } else {
      this.addToCartButton = true;
    }
  }

  getVariantInfo(skuId) {
    let array = this.product.variantFormArray;

    this.selectedVariantData = array.find(
      ({ variantSku }) => variantSku === skuId
    );

    this.existInCart = this.checkCartItems(this.selectedVariantData);

    if (this.selectedVariantData === undefined) {
      this.selectedVariantData = array[0];
      this.globalQuantity = this.product.quantity;
      this.clickVariant = false;
      this.globalPrice = this.product.sellingPrice;
      this.globalContinue = this.product.continueSelling;
    } else {
      this.clickVariant = true;
      this.globalQuantity = this.selectedVariantData.variantQuantity;
      this.globalPrice = this.selectedVariantData.variantPrice;
      this.globalContinue = this.selectedVariantData.variantContinueSelling;
    }
    console.log("exist in cart",this.existInCart);

  }

  initializeArrays() {
    //  for making buttons clickable
    for (let i = 0; i < this.product.options.length; i++) {
      this.clickActive[i] = [];
    }
  }

  /**
   * QUANTITY CONTROL
   */

  incrementQty() {
    if (this.globalQuantity) {
      // If you have global quantity depends on product variants have or not
      if (this.globalContinue === true) {
        if( this.globalQuantity > 0 && this.globalQuantity <= this.selectedQty){
          this.uiService.warn('Cannot add more than stock quantity');
        } else {
        this.selectedQty += 1;
        }
      } else if (this.globalQuantity > this.selectedQty) {
        this.selectedQty += 1;
      }  else {
        this.uiService.warn('Cannot add more than stock quantity');
      }
    } else {
      // If you have no global quantity
      if (this.globalContinue === true) {
        this.selectedQty += 1;
      } else if (this.product?.quantity > this.selectedQty) {
        this.selectedQty += 1;
      }else {
        this.uiService.warn('Cannot add more that stock quantity');
      }
    }


    // if(this.product?.quantity === this.selectedQty){
    //   this.selectedQty += 1;
    // }else if(this.product.continueSelling){
    //   this.selectedQty += 1;
    // }
    // else{
    //   this.uiService.warn("Cannot add more that stock quantity")
    // }
  }

  decrementQty() {
    if (this.selectedQty === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    this.selectedQty -= 1;

    if (this.globalQuantity) {
      if (this.globalQuantity >= this.selectedQty) {
        this.addToCartButton = true;
      }
    }
  }

  openRegistrationDialog() {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      panelClass: ['theme-dialog'],
      height: '60%',
      autoFocus: false,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      console.log(dialogResult);
      // if (dialogResult.regProgress) {
      //   console.log('OTP matched');
      //   this.spinner.show();
      // } else {
      //   console.log('OTP not matched or closed dialog');
      // }
      if(this.isUserAuth){
        this.addToCarts();
        this.openCartDialog();
      }
      //this.selectedVariant(this.variantOptions[i][x])
      //
    });
  }

  /**
   * Select Image
   */

  public selectImage(image: any) {
    this.image = image;
  }

  /**** toggle */
  detailsToggle() {
    this.details = true;
    this.review = false;
    this.shipping = false;
  }
  reviewToggle() {
    this.details = false;
    this.review = true;
    this.shipping = false;
  }
  shippingToggle() {
    this.details = false;
    this.review = false;
    this.shipping = true;
  }

  get canCOD(){
    if(this.product?.canPartialPayment !== true){
      return "Yes";
    }else if(this.globalQuantity !== 0){
      return "Yes";
    }else if (this.globalContinue !== true){
      return "Yes";
    }else{
      return "No";
    }
  }

  /*** Product Carde One Data */

  cardOneData: any[] = [
    {
      _id: '1',
      medias: ['./assets/images/image/Brush_Holder-min.png'],
      images: ['./assets/images/image/Brush_Holder-min.png'],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '2',
      medias: [
        './assets/images/image/c1b95cc5-d2e3-4cba-87e3-6b646eb7e1ec.png',
      ],
      images: [
        './assets/images/image/c1b95cc5-d2e3-4cba-87e3-6b646eb7e1ec.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '3',
      medias: ['./assets/images/image/shoe.png'],
      images: ['./assets/images/image/shoe.png'],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '4',
      medias: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      images: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '5',
      medias: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      images: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
  ];

  alsoLikeProductCard: ProductCardOne[] = [
    {
      _id: '1',
      title: "Waterproof Men's Casual Watch",
      image: './assets/images/image/images (1).png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '2',
      title: "Waterproof Men's Casual Watch",
      image: './assets/images/image/images (1).png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '3',
      title: "Waterproof Men's Casual Watch",
      image: './assets/images/image/images (1).png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '4',
      title: "Waterproof Men's Casual Watch",
      image: './assets/images/image/images (1).png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
  ];
}
