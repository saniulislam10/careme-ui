import { ConversionRate } from 'src/app/interfaces/conversion-rate';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-conversion-rate',
  templateUrl: './add-conversion-rate.component.html',
  styleUrls: ['./add-conversion-rate.component.scss'],
})
export class AddConversionRateComponent implements OnInit {
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;
  // Rate AREA
  conversionRate: ConversionRate;
  // Reactive Form
  dataForm: FormGroup;
  websiteName = new FormControl('', [Validators.required]);
  url = new FormControl('', [Validators.required]);
  rate = new FormControl('', [Validators.required]);
  // Store Product
  id: string = null;

  demoData = [
    {
      websiteName: 'Amazon',
      url: 'www.amazon.com',
    },
    {
      websiteName: 'Aliexpress',
      url: 'www.aliexpress.com',
    },
    {
      websiteName: 'Flipkart',
      url: 'www.flipkart.com',
    },
  ];

  constructor(
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService
  ) {}

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleConversionRateById();
      }
    });

    // Main reactive form..
    this.dataForm = new FormGroup({
      websiteName: this.websiteName,
      url: this.url,
      rate: this.rate,
    });
  }

  // Main Login Method..
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.wrong('Invalid Input field!');
      return;
    }
    // Spinner..
    this.spinner.show();

    const rawData = this.dataForm.value;

    if (this.id) {
      const mData = { ...this.dataForm.value, ...{ _id: this.id } };
      this.editConversionRate(mData);
    }
    if (!this.id) {
      this.addConversionRate(rawData);
    }
  }

  // get single product by id
  private getSingleConversionRateById() {
    this.subDataOne = this.productService
      .getSingleConversionRateById(this.id)
      .subscribe(
        (res) => {
          this.conversionRate = res.data;

          if (this.conversionRate) {
            this.dataForm.patchValue({
              websiteName: this.conversionRate.websiteName,
              url: this.conversionRate.url,
              rate: this.conversionRate.rate,
            });
            // this.patchFormData();
            // this.getAllSubCategoryByCategoryId(this.product.parentCategory);
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  // Product Add
  addConversionRate(data: any) {
    this.productService.addConversionRate(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        // this.templateForm.resetForm();
        this.spinner.hide();
        this.reloadService.needRefreshProduct$;
        this.router.navigate(['admin/conversion-rate']);
      },
      (error) => {
        this.spinner.hide();
        this.uiService.warn(error.message);
      }
    );
  }
  private editConversionRate(data: any) {
    this.productService.editConversionRate(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.reloadService.needRefreshProduct$;
        this.router.navigate(['admin/conversion-rate']);
      },
      (error) => {
        this.spinner.hide();
        this.uiService.warn(error.message);
      }
    );
  }
}
