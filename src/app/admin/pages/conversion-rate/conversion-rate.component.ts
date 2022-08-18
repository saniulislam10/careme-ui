import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ConversionRate } from 'src/app/interfaces/conversion-rate';
import { Pagination } from 'src/app/interfaces/pagination';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-conversion-rate',
  templateUrl: './conversion-rate.component.html',
  styleUrls: ['./conversion-rate.component.scss'],
})
export class ConversionRateComponent implements OnInit {
  // Rate AREA
  conversionRate: ConversionRate[] = [];
  private holdPrevData: any[] = [];
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  // Subscriptions
  private subConversionRate: Subscription;
  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;
  totalProductsStore = 0;
  // sort
  public sortQuery = { createdAt: -1 };
  public activeSort = null;

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
    this.getAllConversionRate();

    // OBSERVABLE
    this.reloadService.refreshConversionRate$.subscribe(() => {
      this.getAllConversionRate();
    });
  }
  onDelete(id:string){
    this.spinner.show();
     this.productService.deleteConversionRateById(id).subscribe(
       (res) => {
        this.uiService.success(res.message);
        // this.templateForm.resetForm();
        this.spinner.hide();
        this.reloadService.needRefreshConversionRate$();
       },
       (error) => {
         this.spinner.hide();
         console.log(error);
       }
     );
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

  private getAllConversionRate() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString(),
    };

    const select = '';
    this.subConversionRate = this.productService
      .getAllConversionRate()
      .subscribe(
        (res) => {
          this.conversionRate = res.data;

          this.totalProducts = res.count;
          this.totalProductsStore = res.count;
          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
          console.log(error);
        }
      );
  }
}
