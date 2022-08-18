import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AmountType } from 'src/app/enum/amount-type';
import { ProductStatus } from 'src/app/enum/product-status';
import { Weight } from 'src/app/enum/weight';
import { Product } from 'src/app/interfaces/product';
import { ProductBySearch } from 'src/app/interfaces/product-by-search';
import { Select } from 'src/app/interfaces/select';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { SearchService } from 'src/app/services/search.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilsService } from 'src/app/services/utils.service';
let psl = require('psl');
import "quill-emoji/dist/quill-emoji.js";


//for quill
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { Category } from 'src/app/interfaces/category';
import { SubCategory } from 'src/app/interfaces/sub-category';
Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-add-by-link',
  templateUrl: './add-by-link.component.html',
  styleUrls: ['./add-by-link.component.scss'],
})
export class AddByLinkComponent implements OnInit {

  id: any;
  autoSlug: boolean = true;
  // search
  public dataForm: FormGroup;
  url: string;
  searchProduct: ProductBySearch;
  websiteBaseLink: string;

  //Add Product
  public formData: FormGroup;
  product: Product;
  banner: string;
  bannerPlaceholder = './assets/images/junk/1218NP_economicoutlook_img1.jpg';
  description: string;

  // category
  categories = null;
  subCategories = null;
  public filteredCatList: Category[];
  public filteredSubCatList: SubCategory[];
  // modules = null;
  editorData: any;

  amountType: Select[] = [
    { value: AmountType.AMOUNT, viewValue: 'Amount' },
    { value: AmountType.PERCENTAGE, viewValue: 'Percent' },
  ];

  weightType: Select[] = [
    { value: Weight.KG, viewValue: 'Kg' },
    { value: Weight.G, viewValue: 'g' },
    { value: Weight.LB, viewValue: 'lb' },
    { value: Weight.OZ, viewValue: 'oz' },
  ];
  private sub?: Subscription;
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;

  modules = {};
  content = "";

  constructor(
    private uiService: UiService,
    private searchService: SearchService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute
  ) {
    this.modules = {
      // 'emoji-shortname': true,
      // 'emoji-textarea': false,
      // 'emoji-toolbar': true,
      blotFormatter: {
        // empty object for default behaviour.
      },
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button

          ['link', 'image', 'video'], // link and image, video
          ['emoji'],
        ],
        // handlers: { 'emoji': function () { } },
      },
    };
  }

  ngOnInit(): void {

    this.initFormGroup();
    this.getAllCategories();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleProductById();
      } else {
        this.banner = this.bannerPlaceholder;
        this.autoGenerateSlug();
        this.spinner.hide();
      }
    });

  }

  addBindingCreated(quill) {
    quill.keyboard.addBinding(
      {
        key: "b"
      },
      (range, context) => {
        // tslint:disable-next-line:no-console
        console.log("KEYBINDING B", range, context);
      }
    );

    quill.keyboard.addBinding(
      {
        key: "B",
        shiftKey: true
      },
      (range, context) => {
        // tslint:disable-next-line:no-console
        console.log("KEYBINDING SHIFT + B", range, context);
      }
    );
  }

  /**
   * Initialzing
   */

  initFormGroup(){
    this.dataForm = this.fb.group({
      url: [null, Validators.required],
    });
    this.formData = this.fb.group({
      name: [null, Validators.required],
      slug: [null],
      parentCategory: [null, Validators.required],
      childCategory: [null, Validators.required],
      type: [null],
      tags: [null],
      vendor: [null],
      weight: [null, Validators.required],
      // weightType: [null, Validators.required],
      multyPrice: [null],
      multyWeight: [null],
      moq: [null],
      sku: [null, Validators.required],
      partialPayment: [null],
      partialPaymentType: [null],
      earnPoints: [null],
      earnPointsType: [null],
      sellingPrice: [null, Validators.required],
      description: [null],
    });
  }

  // auto slug
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.formData
        .get('name')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, '-')
            .toLowerCase();
          this.formData.patchValue({
            slug: res,
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  /**
   * Http Req
   */

  // get single product by id
  private getSingleProductById() {
    this.subDataOne = this.productService
      .getSingleProductById(this.id)
      .subscribe(
        (res) => {
          this.product = res.data;
          if (this.product) {
            this.patchFormData();
            this.getAllSubCategoryByCategoryId(this.product.parentCategory);
          }
        },
        (error) => {
          this.uiService.warn(error);
          console.log(error);
        }
      );
  }

  // Get categories
  getAllCategories() {
    this.spinner.show();
    this.categoryService.getAllCategory().subscribe(
      (res) => {
      this.categories = res.data;
      this.filteredCatList = this.categories.slice();
      this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  // get sub category
  private getAllSubCategoryByCategoryId(id) {
    this.spinner.show();
    this.subCategoryService.getSubCategoryByCategoryId(id).subscribe(
      (res) => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  /**
   * Submit Forms
   */

  onSubmit() {
    this.spinner.show();
    console.log(this.formData.value);
    let websiteName = new URL(this.dataForm.value.url).hostname;

    if (this.formData.invalid) {
      this.uiService.warn('Please complete all the required fields');
      this.spinner.hide();
      return;
    }
    let product = {
      link: this.dataForm.value.url,
      website: websiteName,
      name: this.formData.value.name,
      slug: this.formData.value.slug,
      parentCategory: this.formData.value.parentCategory,
      childCategory: this.formData.value.childCategory,
      type: this.formData.value.type,
      tags: this.formData.value.tags,
      vendor: this.formData.value.vendor,
      weight: this.formData.value.weight,
      weightType: this.formData.value.weightType,
      multyPrice: this.formData.value.multyPrice,
      multyWeight: this.formData.value.multyWeight,
      moq: this.formData.value.moq,
      sku: this.formData.value.sku,
      canPartialPayment: true,
      partialPayment: this.formData.value.partialPayment,
      partialPaymentType: this.formData.value.partialPaymentType,
      canEarnPoints: true,
      earnPoints: this.formData.value.earnPoints,
      earnPointsType: this.formData.value.earnPointsType,
      canRedeemPoints: false,
      status: ProductStatus.ACTIVE,
      stock: 49, // need to fix
      images: [this.banner],
      hasLink: true,
      sellingPrice: this.formData.value.sellingPrice,
      description: this.formData.value.description
    };
    if (this.product) {
      product = {...product, ...{_id: this.product._id}}
      product = {...product, ...{link: this.product.link}}
      this.productService.editProductById(product).subscribe(
        (res) => {
          this.uiService.success(res.message);
          this.spinner.hide();
        },
        (err) => {
          this.uiService.warn(err);
          this.spinner.hide();
        }
      );
    }
    else {
      this.productService.addSingleProduct(product).subscribe(
        (res) => {
          this.uiService.success(res.message);
          this.spinner.hide();
        },
        (err) => {
          this.uiService.warn(err.error.message);
          console.log(err);
          this.spinner.hide();
        }
      );
      this.spinner.hide();
    }
  }


  patchFormData() {
    this.formData.patchValue(this.product);
    this.banner = this.product.images[0];
  }



  onSelectCategory(event: MatSelectChange) {
    this.getAllSubCategoryByCategoryId(event.value);
  }



  onSearch() {
    let link = this.dataForm.value.url;
    this.searchByWebsite(link);
  }
  setValue(option: any) {
    if (option.url) {
      const link = this.websiteBaseLink + option.url;
      this.searchByWebsite(link);
      // this.router.navigate([link]);
    }
    if (option.price) {
      this.formData.patchValue({
        price: option.price,
      });
    }
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
    }
    else{
      this.uiService.warn("Url Not Supported");
    }
  }

  getAmazonProduct(link: String) {
    this.spinner.show();
    this.searchService.getProductFromAmazonManual(link)
    .subscribe(
      (res) => {
        this.setData(res.data, link);
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
        this.setData(res.data, link);
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
    this.searchService.getProductFromFlipKart(link)
    .subscribe(
      (res) => {
        this.setData(res.data, link);
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
        this.setData(res.data, link);
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  getEbayProduct(link: string) {
    this.spinner.show();
    this.searchService.getProductFromEbay(link).subscribe(
      (res) => {
        this.setData(res.data, link);
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
      }
    );
  }

  setData(data, link){
    console.log(data);

    this.searchProduct = data;
    this.searchService.setSearchLink(link);
    this.searchService.setSearchProduct(this.searchProduct);
    if (data) {
      this.description = this.searchProduct.description;
      this.banner = this.searchProduct.images[0];
      this.formData.patchValue({
        name: data.name,
        sellingPrice: data.discountedPrice ? data.discountedPrice : data.sellingPrice,
      });
    }
  }



 /**
   * INIT Quill
   */

  // private async initModule() {
  //   this.modules = {
  //     // 'emoji-shortname': true,
  //     // 'emoji-textarea': false,
  //     // 'emoji-toolbar': true,
  //     blotFormatter: {
  //       // empty object for default behaviour.
  //     },
  //     toolbar: {
  //       container: [
  //         ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  //         ['blockquote', 'code-block'],

  //         [{ header: 1 }, { header: 2 }], // custom button values
  //         [{ list: 'ordered' }, { list: 'bullet' }],
  //         [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  //         [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  //         [{ direction: 'rtl' }], // text direction

  //         [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  //         [{ header: [1, 2, 3, 4, 5, 6, false] }],

  //         [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  //         [{ font: [] }],
  //         [{ align: [] }],

  //         ['clean'], // remove formatting button

  //         ['link', 'image', 'video'], // link and image, video
  //         ['emoji'],
  //       ],
  //       // handlers: { 'emoji': function () { } },
  //     },
  //   };
  // }


    /**
   * Quil Functions
   */

     blured = false;
     focused = false;

     created(event: any) {
       // tslint:disable-next-line:no-console
     }

     changedEditor(event: EditorChangeContent | EditorChangeSelection) {
       // tslint:disable-next-line:no-console
       this.editorData = event;
     }

     focus($event: any) {
       // tslint:disable-next-line:no-console
       this.focused = true;
       this.blured = false;
     }

     blur($event: any) {
       // tslint:disable-next-line:no-console
       this.focused = false;
       this.blured = true;
     }


}
