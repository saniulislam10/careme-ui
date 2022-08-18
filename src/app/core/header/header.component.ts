import { StorageService } from './../../services/storage.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/interfaces/category';
import { CategoryMenu } from 'src/app/interfaces/category-menu';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { SearchService } from 'src/app/services/search.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATABASE_KEY } from '../utils/global-variable';
import { UiService } from 'src/app/services/ui.service';
import { ProductBySearch } from 'src/app/interfaces/product-by-search';
import { RegistrationDialogComponent } from '../../shared/dialog-view/registration-dialog/registration-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/interfaces/cart';
import { ReloadService } from 'src/app/services/reload.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  // search
  public dataForm: FormGroup;
  url: any;
  searchProduct: ProductBySearch;
  websiteBaseLink: string;
  headerFixed = false;
  categoryMenu = false;
  resCateMenu = false;
  resHomeMenu = true;
  slideMenu = false;
  subCategoryMenu = false;
  categoryBar = true;
  user: User = null;
  isUserAuth = false;

  carts = [];

  //Category
  category: CategoryMenu[];
  constructor(
    private searchService: SearchService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private storageService: StorageService,
    private uiService: UiService,
    private dialog: MatDialog,
    private cartService: CartService,
    private reloadService: ReloadService,
    public userDataService: UserDataService,
    public userService: UserService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      url: [null, Validators.required],
    });
    this.fixedHeader();
    this.getCategoryItems();
    this.getCartItemList();
    /** CATEGORY BAR CONTROLL */
    this.categoryBarControll();
    window.onscroll = (e) => {
      this.categoryBarControll();
    };
    this.router.events.subscribe(() => {
      this.categoryBarControll();
    });

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartItemList(true);
      // this.cd.markForCheck();
    });
    this.getCartItemList();



    // this.userService.getUserStatusListener().subscribe(() => {
    //   this.isUserAuth = this.userService.getUserStatus();
    //   if (this.isUserAuth) {
    //     this.getLoggedInUserInfo();
    //   }
    // });
    this.reloadService.refreshUser$
    .subscribe( () => {
      this.isUserAuth = this.userService.getUserStatus();
    })
    this.isUserAuth = this.userService.getUserStatus();
    console.log(this.isUserAuth);

    if (this.isUserAuth) {
      this.getLoggedInUserInfo();
    }
  }
  @HostListener('window:scroll')
  fixedHeader() {
    if (this.router.url == '/') {
      if (window.scrollY > 700) {
        this.headerFixed = true;
      } else {
        this.headerFixed = false;
      }
    } else {
      if (window.scrollY > 300) {
        this.headerFixed = true;
      } else {
        this.headerFixed = false;
      }
    }
  }

  /***
   * Category-menu tigger
   *  categoryMenuToggle(){
    if( this.router.url =="/" && window.scrollY > 500 || window.innerWidth < 1050){
      this.categoryMenu =! this.categoryMenu;
    }else if(this.router.url != "/"){
      this.categoryMenu =! this.categoryMenu;
    }
  }
   */
  categoryMenuShow() {
    if (this.router.url == '/') {
      if (window.scrollY > 500 || window.innerWidth < 1050) {
        this.categoryMenu = !this.categoryMenu;
      } else {
        this.categoryMenu = false;
      }
    } else {
      this.categoryMenu = !this.categoryMenu;
    }
  }
  categoryMenuHide() {
    this.categoryMenu = false;
  }

  subCategoryMenuToggle(id) {
    if (this.router.url == '/') {
      if (window.scrollY > 500 || window.innerWidth < 1050) {
        this.subCategoryMenu = !this.subCategoryMenu;
      } else {
        this.subCategoryMenu = false;
      }
    } else {
      this.subCategoryMenu = !this.subCategoryMenu;
    }
    this.getSubCategoriesByCategory(id);
  }

  categoryBarControll() {
    if (this.router.url == '/' || this.router.url == '/products-list') {
      if (window.scrollY > 500 || window.innerWidth < 1050) {
        this.categoryBar = true;
      } else {
        this.categoryBar = false;
      }
    } else {
      this.categoryBar = true;
    }
  }
  /**
   * Responsive menu toggle
   */
  resCategoryMenuActive() {
    this.resCateMenu = true;
    this.resHomeMenu = false;
  }
  resHomeMenuActive() {
    this.resCateMenu = false;
    this.resHomeMenu = true;
  }
  /***
   * Slide menu
   */
  slideMenuActive() {
    this.slideMenu = true;
  }
  slideMenuInactive() {
    this.slideMenu = false;
  }
  /* SEARCH */
  onSearch() {
    let link = this.dataForm.value.url;
    this.searchByWebsite(link);
    this.storageService.removeSessionData(
      DATABASE_KEY.requestedScrappingProduct
    );
    this.storageService.removeSessionData(DATABASE_KEY.scrappedWeblink);
  }
  // need to change
  async searchByWebsite(link: any) {
    let url = new URL(link).hostname;

    // if (url === 'www.amazon.com') {
    //   this.websiteBaseLink = 'https://www.amazon.com';
    //   this.searchService.setProductType('amazon');
    //   await this.getAmazonProduct(link);
    // } else
    if (url === 'www.aliexpress.com') {
      this.websiteBaseLink = 'https://www.aliexpress.com';
      this.searchService.setProductType('aliexpress');
      await this.getAliexpressProduct(link);
    } else if (url === 'www.flipkart.com') {
      this.websiteBaseLink = 'https://www.flipkart.com';
      this.searchService.setProductType('flipkart');
      await this.getFlipKartProduct(link);
    } else if (url === 'www.myntra.com') {
      this.websiteBaseLink = 'https://www.myntra.com';
      this.searchService.setProductType('myntra');
      await this.getMyntraProduct(link);
    } else if (url === 'www.ebay.com') {
      this.websiteBaseLink = 'https://www.ebay.com';
      this.searchService.setProductType('ebay');
      await this.getEbayProduct(link);
    } else if (url === 'www.walmart.com') {
      this.websiteBaseLink = 'https://www.walmart.com';
      this.searchService.setProductType('walmart');
      await this.getWalmartProduct(link);
    }
    else {
      this.uiService.warn('Url Not Supported');
    }
  }
  getAmazonProduct(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAmazonManual(link).subscribe(
      (res) => {
        this.searchProduct = res.data;
        this.searchService.setSearchLink('https://www.amazon.com');
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  getAliexpressProduct(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAliexpress(link).subscribe(
      (res) => {
        this.searchProduct = res.data;
        this.searchService.setSearchLink('https://www.aliexpress.com');
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
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
        this.searchProduct = res.data;
        this.searchService.setSearchLink('https://www.flipkart.com');
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
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
        this.searchProduct = res.data;
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
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
        this.searchProduct = res.data;
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getWalmartProduct(link: string) {
    this.spinner.show();
    this.searchService.getProductFromWalmart(link).subscribe(
      (res) => {
        this.searchProduct = res.data;
        this.searchService.setSearchLink(link);
        this.searchService.setSearchProduct(this.searchProduct);
        this.router.navigateByUrl('/product-details-search');
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }
  // this.redirectTo('/product-details-search');

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  /* HTTP REQ */
  private getCategoryItems() {
    this.menuService.getAllCategoryMenu().subscribe(
      (res) => {
        this.category = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  private getSubCategoriesByCategory(id) {
    this.subCategoryService.getSubCategoryByCategoryId(id).subscribe(
      (res) => {
        console.log(res.data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  openRegistrationDialog() {
    const dialogRef = this.dialog.open(RegistrationDialogComponent, {
      panelClass: ['theme-dialog'],
      height: '60%',
      autoFocus: false,
      disableClose: false,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      this.reloadService.needRefreshUser$();
      if (dialogResult.regProgress) {
        this.spinner.show();
      } else {
        console.log('OTP not matched or closed dialog');
      }
    });
  }

  //cart length
  private getCartItemList(refresh?: boolean) {
    this.cartService.getCartItemList().subscribe(
      (res) => {
        this.carts = res.data;
        // this.cartLenght = this.carts.length
      },
      (error) => {
        console.log(error);
      }
    );
  }


  /**
 * HTTP REQ HANDLE
 */

  private getLoggedInUserInfo() {
    // const select = 'fullName';
    this.userDataService.getLoggedInUserInfo()
      .subscribe(res => {
        this.user = res.data;
        console.log("user", this.user);

      }, error => {
        console.log(error);
      });
  }

  userLogOut(){
    this.userService.userLogOut();
    this.reloadService.needRefreshUser$();
  }

}
