import { Component, OnInit, ViewChild } from '@angular/core';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { SearchService } from 'src/app/services/search.service';
import { ProductBySearch } from 'src/app/interfaces/product-by-search';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';
import { AddToCartPopupComponent } from '../product-details/add-to-cart-popup/add-to-cart-popup.component';
import { Cart } from 'src/app/interfaces/cart';
import { ProductStatus } from 'src/app/enum/product-status';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SizeChartService } from 'src/app/services/size-chart.service';
import { UiService } from 'src/app/services/ui.service';
import { CarouselCntrlService } from 'src/app/services/carousel-cntrl.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { StockControlService } from 'src/app/services/stock-control.service';
import { ProductStatusPipe } from 'src/app/shared/pipes/product-status.pipe';
import { SizeChart } from 'src/app/interfaces/size-chart';
import { Subscription } from 'rxjs';
import { BuyNowForNewUserComponent } from '../product-details/buy-now-for-new-user/buy-now-for-new-user.component';
import { Product } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { StorageService } from 'src/app/services/storage.service';
import { RegistrationDialogComponent } from 'src/app/shared/dialog-view/registration-dialog/registration-dialog.component';
import { RequestPricePipe } from 'src/app/shared/pipes/requestPrice.pipe';

@Component({
  selector: 'app-product-details-search',
  templateUrl: './product-details-search.component.html',
  styleUrls: ['./product-details-search.component.scss'],
  providers: [ProductStatusPipe, RequestPricePipe],
})
export class ProductDetailsSearchComponent implements OnInit {
  @ViewChild('addToCartPup') addToCart: AddToCartPopupComponent;
  @ViewChild('newUser') newUser: BuyNowForNewUserComponent;

  carts: Cart[] = [];
  priceNew: number;
  globalRate: number = 1;
  globalPrice: number;
  // button active
  user: User;
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
  images: any;
  stockMessage: any;
  data: any;
  websiteBaseLink: String;
  banner: string;
  description: string;
  url: any;
  details = true;
  review = false;
  shipping = false;
  variantId: any[] = [];
  optionId: any = '';

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
    private requestPricePipe: RequestPricePipe,
    private dialog: MatDialog,
    private searchService: SearchService,
    private storageSession: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.slug = param.get('slug');

      if (this.slug) {
        this.getSingleProductBySlug();
      } else {
        this.getPrice();
        this.websiteBaseLink = this.searchService.getSearchLink();
        this.data = this.searchService.getSearchProduct();
        this.getFirstPrice();
        this.initializeArrays(this.data);
      }

      if (this.data?.images && this.data?.images.length > 0) {
        this.image = this.data.images[0];
      }
      this.url = this.searchService.getSearchLink();
      this.checkUrl(this.url);
    });

    this.reloadService.refreshUser$
    .subscribe(()=>{
      this.getUser();
      this.getCartItemList();
    })

    this.reloadService.refreshCart$
    .subscribe(()=>{
      this.getCartItemList();
    })
    this.getUser();
    this.getCartItemList();
    // this.getStockControl();
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

  getBaseUrl(url: string) {
    let fullUrl = new URL(url);
    let baseUrl = fullUrl.origin;
    return baseUrl;
  }

  checkConversionRate(link: any) {
    this.productService.getSpecificConversionRateByUrl(link).subscribe(
      (res) => {
        this.globalRate = res.data;
      },
      (error) => {
        console.log(error);
        this.globalRate = 1;
      }
    );
  }

  getFirstPrice() {
    this.setPriceByRate();
    this.productService
      .getSpecificConversionRateByUrl(this.websiteBaseLink)
      .subscribe(
        (res) => {
          this.globalRate = res.data;
          this.setPriceByRate();
        },
        (error) => {
          this.globalRate = 1;
          this.setPriceByRate();
          console.log(error);
        }
      );
  }

  setPriceByRate() {
    if (this.data?.discountedPrice) {
      this.globalPrice = Math.round(
        this.data.discountedPrice * this.globalRate
      );
    } else if (this.data?.sellingPrice) {
      this.globalPrice = Math.round(this.data.sellingPrice * this.globalRate);
    }
  }

  getPrice() {
    if (this.product) {
      if (this.product?.hasLink) {
        if (this.data?.discountedPrice) {
          this.globalPrice = Math.round(
            this.data?.discountedPrice * this.product?.multyPrice +
              this.product?.weight * this.product?.multyWeight
          );
        } else {
          this.globalPrice = Math.round(
            this.data?.sellingPrice * this.product?.multyPrice +
              this.product?.weight * this.product?.multyWeight
          );
        }
      } else {
        this.globalPrice = 0;
      }
    } else {
      if (this.data) {
        if (this.data.discountedPrice) {
          this.globalPrice = Math.round(
            this.data?.discountedPrice * this.globalRate
          );
        } else {
          this.globalPrice = Math.round(
            this.data?.sellingPrice * this.globalRate
          );
        }
      } else {
        this.globalPrice = 0;
      }
    }
  }

  checkUrl(link: any) {
    let base = this.getBaseUrl(link);
    this.websiteBaseLink = base;
    this.storeWebsiteLink(this.websiteBaseLink);
  }
  // selectedVariants: any[] = [];
  setValue(option: any, i, index) {
    console.log("variant clicked",option);
    console.log(this.websiteBaseLink);

    this.clickActive[i] = [];
    this.clickActive[i][index] = !this.clickActive[i][index];
    // if (this.websiteBaseLink === 'https://www.amazon.com') {
    //   if (option.price) {
    //     this.globalPrice = Math.round(option.price * this.globalRate);
    //   } else if (option.url) {
    //     this.globalPrice = this.data.sellingPrice;
    //   }
    // } else
    if (this.websiteBaseLink === 'https://www.flipkart.com') {
      if (option.url) {
        const link = this.websiteBaseLink + option.url;
        this.getFlipKartProductForVariant(link);
      }
    } else if (this.websiteBaseLink === 'https://www.aliexpress.com') {
      if (i === 0) {
        this.variantId[0] = '';
        this.variantId[0] = String(option.id);
      } else {
        this.variantId[i] = '';
        this.variantId[i] = ',' + option.id;
      }

      let newId: any = '';
      for (let a = 0; a < this.variantId.length; a++) {
        newId += this.variantId[a];
      }
      this.optionId = newId;
      let array1 = this.data.variants.prices;
      if (array1) {
        let variantObject = array1.find(
          (item) => item.optionValueIds === this.optionId
        );
        if (variantObject) {
          this.globalPrice = Math.round(
            variantObject.salePrice * this.globalRate
          );
          this.onContinueToAnotherPage(this.data);
        }
      }
    } else if (this.websiteBaseLink === 'https://www.myntra.com') {
      if (option.url) {
        const link = option.url;
        this.getMyntraProduct(link);
      }
    } else if (this.websiteBaseLink === 'https://www.ebay.com') {
      console.log(option.price);

      if (option.price) {
        this.globalPrice = option.price;
      }
    }
  }

  async searchByWebsite(link: any) {
    let url = new URL(link).hostname;

    // if (url === 'www.amazon.com') {
    //   this.websiteBaseLink = 'https://www.amazon.com';
    //   this.checkConversionRate(this.websiteBaseLink);
    //   this.searchService.setProductType('amazon');
    //   await this.getAmazonProduct(link);
    // } else
    if (url === 'www.aliexpress.com') {
      this.websiteBaseLink = 'https://www.aliexpress.com';
      this.checkConversionRate(this.websiteBaseLink);
      this.searchService.setProductType('aliexpress');
      await this.getAliexpressProduct(link);
    } else if (url === 'www.flipkart.com') {
      this.websiteBaseLink = 'https://www.flipkart.com';
      this.checkConversionRate(this.websiteBaseLink);
      this.searchService.setProductType('flipkart');
      await this.getFlipKartProduct(link);
    } else if (url === 'www.myntra.com') {
      this.websiteBaseLink = 'https://www.myntra.com';
      this.checkConversionRate(this.websiteBaseLink);
      this.searchService.setProductType('myntra');
      await this.getMyntraProduct(link);
    } else if (url === 'www.ebay.com') {
      this.websiteBaseLink = 'https://www.ebay.com';
      console.log(this.websiteBaseLink);
      this.checkConversionRate(this.websiteBaseLink);
      this.searchService.setProductType('ebay');
      await this.getEbayProduct(link);
    } else {
      this.uiService.warn('Url Not Supported');
    }
  }

  getAmazonProduct(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAmazonManual(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        this.initializeArrays(this.data);
        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.data);
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getAmazonProductForVariant(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAmazon(link).subscribe(
      (res) => {
        console.log(res.data);
        if (res.data.price) {
          this.globalPrice = Math.floor(res.data.price);
        }
        // this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  async getAliexpressProduct(link: String) {
    this.spinner.show();
    await this.searchService.getProductFromAliexpress(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        this.initializeArrays(this.data);
        // this.globalPrice = this.data;s

        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        this.searchService.setSearchLink('https://www.aliexpress.com/');
        this.searchService.setSearchProduct(this.data);
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  // FlipKart
  getFlipKartProduct(link: string) {
    this.spinner.show();
    this.searchService.getProductFromFlipKart(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        this.initializeArrays(this.data);
        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.data);
        if (this.data.discountedPrice) {
          this.globalPrice = Math.round(
            this.data.discountedPrice * this.globalRate
          );
        } else {
          this.globalPrice = Math.round(
            this.data.sellingPrice * this.globalRate
          );
        }
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getFlipKartProductForVariant(link: string) {
    this.spinner.show();
    this.searchService.getProductFromFlipKart(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.data);
        if (this.data.discountedPrice) {
          this.globalPrice = Math.round(
            this.data.discountedPrice * this.globalRate
          );
        } else {
          this.globalPrice = Math.round(
            this.data.sellingPrice * this.globalRate
          );
        }
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  // Myntra
  getMyntraProduct(link: string) {
    this.spinner.show();
    this.searchService.getProductFromMyntra(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        this.initializeArrays(this.data);
        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.data);
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  // EBAY
  getEbayProduct(link: string) {
    this.spinner.show();
    this.searchService.getProductFromEbay(link).subscribe(
      (res) => {
        this.spinner.hide();
        this.data = res.data;
        console.log("ebay data", this.data);

        this.initializeArrays(this.data);
        if (this.data) {
          this.onContinueToAnotherPage(this.data);
        }
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.data);
        if (res.data) {
          this.description = this.data.description;
          this.image = this.data.images[0];
        }
        // this.router.navigateByUrl('/product-details-search');
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  /**
   * Session Storage
   */

  onContinueToAnotherPage(data: any) {
    this.storageSession.storeDataToSessionStorage(
      DATABASE_KEY.requestedScrappingProduct,
      data
    );
  }

  storeWebsiteLink(data: any) {
    this.storageSession.storeDataToSessionStorage(
      DATABASE_KEY.scrappedWeblink,
      data
    );
  }
  getRequestedProduct() {
    return this.storageSession.getDataFromSessionStorage(
      DATABASE_KEY.requestedScrappingProduct
    );
  }
  getWebsiteLink() {
    return this.storageSession.getDataFromSessionStorage(
      DATABASE_KEY.scrappedWeblink
    );
  }

  /*
   * REDIRECT
   */
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
  /**
   * Http Req
   */

  getStockControl() {
    this.stockControlService.getAllStockControl().subscribe(
      (res) => {
        if (this.product?.quantity >= 1) {
          this.stockMessage = res.data.greaterThanZero;
        } else if (this.product?.quantity === 0) {
          this.stockMessage = res.data.zero;
        } else {
          this.stockMessage = res.data?.lessThanZero;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // get single product by slug
  async getSingleProductBySlug() {
    this.spinner.show();
    await this.productService.getSingleProductBySlug(this.slug).subscribe(
      (res) => {
        if (res.data.status === ProductStatus.ACTIVE) {
          this.spinner.hide();
          this.product = res.data;
          this.searchByWebsite(this.product.link);
          this.getImages();
          this.getPrice();
          // this.websiteBaseLink = this.searchService.getSearchLink();
          this.data = this.searchService.getSearchProduct();
          this.getFirstPrice();
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

  // get images collaboration
  getImages() {
    this.images = this.productService.getImages(
      this.product.medias,
      this.product.images
    );
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

  /** http req ends */

  /**
   * Product Info
   */

  setDataForProduct() {
    this.data = this.searchService.getSearchProduct();
    if (this.product) {
      if (this.product.hasVariant === true) {
        this.variantSplit();
        this.variantSku = this.product.sku;
        let skuId = this.product.variantFormArray[0].variantSku;
        this.getVariantInfo(skuId);
      }
      this.getSizeChart();
      if (this.images.length > 0) {
        this.image = this.images[0];
      }
    }
  }

  /**
   * CART FUNCTIONALITY
   */

  private getCartItemList() {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }


  addToCarts() {
    this.priceNew = this.requestPricePipe.transform(this.globalPrice, 1, this.product, this.globalRate);
    console.log(this.product);

    const data: Cart = {
      name: this.data.name,
      image: this.data.images[0],
      selectedQty: this.selectedQty,
      requestProduct: true,
      price: this.priceNew,
      link: this.searchService.getSearchLink(),
      product: this.product
    };

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
    if (!this.user) {
      this.openRegistrationDialog();
      return
    }
    this.cartService.getCartItemType()
    .subscribe(res => {
      let type = res.data;
      if(type === 'regular'){
        this.uiService.warn("Cannot add both regular and request product together in cart");
        return
      }else{
        if (this.data && this.product && this.product.link) {
          if (this.selectedQty < this.product.moq) {
            let msg = 'Need to order minimum ' + this.product.moq;
            this.uiService.warn(msg);
            return;
          }
        }
            this.btnActive = true;
            this.addToCarts();
            this.openCartDialog();
      }
    })

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
      if (dialogResult.regProgress) {
        console.log('OTP matched');
        this.spinner.hide();
      } else {
        console.log('OTP not matched or closed dialog');
      }
    });
  }

  openCartDialog() {
    this.priceNew = this.requestPricePipe.transform(this.globalPrice, 1, this.product, this.globalRate);
    // if (this.product?.link && this.data.discountedPrice) {
    //   this.priceNew =
    //     this.data.discountedPrice * this.product.multyPrice +
    //     this.product.weight * this.product.multyWeight;
    // } else if (this.product?.link && !this.data.discountedPrice) {
    //   this.priceNew =
    //     this.data.sellingPrice * this.product.multyPrice +
    //     this.product.weight * this.product.multyWeight;
    // } else {
    //   this.priceNew = this.data.discountedPrice
    //     ? this.data.discountedPrice
    //     : this.data.sellingPrice;
    // }
    this.dialog.open(AddToCartPopupComponent, {
      data: {
        name: this.data.name,
        selectedQty: this.selectedQty,
        image: this.data.images[0],
        price: this.priceNew,
      },
      // width: '100%',
      // height: '100%',
    });
    // dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
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

  selectedVariant(variantName, i, index) {
    this.clickActive[i] = [];
    this.clickActive[i][index] = !this.clickActive[i][index];
    // this.sku[i] = variantName.charAt(0) + index;
    this.sku[i] = index;
    this.variantSku = this.product.sku + '-';
    for (let y = 0; y < this.product.variants.length; y++) {
      this.variantSku += this.sku[y];
    }
    this.getVariantInfo(this.variantSku);
  }

  getVariantInfo(skuId) {
    let array = this.product.variantFormArray;
    this.selectedVariantData = array.find(
      ({ variantSku }) => variantSku === skuId
    );
    if (this.selectedVariantData === undefined) {
      this.selectedVariantData = array[0];
    }
  }

  initializeArrays(data) {
    if (this.slug) {
      this.globalPrice = this.data.sellingPrice * this.globalRate;
    }

    //  for making buttons clickable
    for (let i = 0; i < data?.variants?.options.length; i++) {
      // for (let i = 0; i < 2; i++) {
      this.clickActive[i] = [];
    }
  }

  /**
   * QUANTITY CONTROL
   */

  incrementQty() {
    this.selectedQty += 1;
  }

  decrementQty() {
    if (this.selectedQty === 1) {
      this.uiService.warn('Minimum Quantity is selected');
      return;
    }
    this.selectedQty -= 1;
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

  getRating(rating) {
    if (rating >= 0 && rating < 0.5) {
      return 0;
    }
    if (rating >= 0.5 && rating < 1) {
      return 0.5;
    }
    if (rating >= 1 && rating < 1.5) {
      return 1;
    }
    if (rating >= 1.5 && rating < 2) {
      return 1.5;
    }
    if (rating >= 2 && rating < 2.5) {
      return 2;
    }
    if (rating >= 2.5 && rating < 3) {
      return 2.5;
    }
    if (rating >= 3 && rating < 3.5) {
      return 3;
    }
    if (rating >= 3.5 && rating < 4) {
      return 3.5;
    }
    if (rating >= 4 && rating < 4.5) {
      return 4;
    }
    if (rating >= 4.5 && rating < 5) {
      return 4.5;
    }
    if (rating === 5) {
      return 5;
    }
  }

  getRoundValue(price,qty,rate){
    return Math.floor(price*qty*rate);
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
      title: 'PARMA Blue orange',
      image: './assets/images/image/PARMA-Blue-orange-06.png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '2',
      title: 'Nike air force',
      image:
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '3',
      title: 'DAEDRIC red',
      image: './assets/images/image/DAEDRIC-red-07.png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
    {
      _id: '4',
      title: 'Headphone',
      image: './assets/images/image/egts.png',
      price: 1280,
      discount: 0,
      routerLink: '#',
    },
  ];
}
