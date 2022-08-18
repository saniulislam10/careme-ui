import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { Product } from 'src/app/interfaces/product';
import { ProductBySearch } from 'src/app/interfaces/product-by-search';
import { SearchService } from 'src/app/services/search.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-request-product',
  templateUrl: './request-product.component.html',
  styleUrls: ['./request-product.component.scss'],
})
export class RequestProductComponent implements OnInit {
  // search
  public dataForm: FormGroup;
  url: any;
  searchProduct: any;
  banner: string;
  description: string;
  websiteBaseLink: string;

  constructor(
    private searchService: SearchService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      url: [null, Validators.required],
      selectedSite: ['Aliexpress', Validators.required],
    });
  }

  onSearch() {
    this.spinner.show();
    let search = {
      url: this.dataForm.value.url,
      selectedSite: this.dataForm.value.selectedSite,
    };
    const link = search.url;
    this.searchService.setSearchLink(link);

    this.searchByWebsite(search);
    this.storageService.removeSessionData(
      DATABASE_KEY.requestedScrappingProduct
    );
    this.storageService.removeSessionData(DATABASE_KEY.scrappedWeblink);
  }

  async searchByWebsite(search: any) {
    const link = search.url;
    // if (search.selectedSite === 'Amazon') {
    //   this.searchService.setProductType(search.selectedSite);
    //   await this.getAmazonProduct(link);
    // } else
    if (search.selectedSite === 'Aliexpress') {
      this.searchService.setProductType(search.selectedSite);
      await this.getAliexpressProduct(link);
    } else if (search.selectedSite === 'Flipkart') {
      this.searchService.setProductType(search.selectedSite);
      await this.getFlipKartProduct(link);
    } else if (search.selectedSite === 'Myntra') {
      this.searchService.setProductType(search.selectedSite);
      await this.getMyntraProduct(link);
    }
  }
  getAmazonProduct(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAmazonManual(link).subscribe(
      (res) => {
        this.searchProduct = res.data;
        this.searchService.setSearchLink("https://www.amazon.com");
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
        this.searchService.setSearchLink("https://www.aliexpress.com");
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
        this.searchService.setSearchLink("https://www.flipkart.com");
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
}
