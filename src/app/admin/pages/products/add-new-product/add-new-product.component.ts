import { ProductType } from 'src/app/interfaces/product-type';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from 'src/app/services/ui.service';
import { ProductStatus } from 'src/app/enum/product-status';
import { Select } from 'src/app/interfaces/select';
import { Product } from 'src/app/interfaces/product';
import { AmountType } from 'src/app/enum/amount-type';
import { Subscription, Subject, Observable } from 'rxjs';
import { Weight } from 'src/app/enum/weight';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ReloadService } from 'src/app/services/reload.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/interfaces/category';
import { SubCategory } from 'src/app/interfaces/sub-category';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Brand } from 'src/app/interfaces/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Vendor } from 'src/app/interfaces/vendor';
import { VendorService } from 'src/app/services/vendor.service';
import { CountryService } from 'src/app/services/country.service';
import { Country } from 'src/app/interfaces/country';
//for quill
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
Quill.register(
  'modules/blotFormatter', BlotFormatter
);
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { ProductTypeService } from 'src/app/services/product-type.service';
import { ImageCropperComponent } from 'src/app/shared/components/image-cropper/image-crop.component';
import { FileData } from 'src/app/interfaces/file-data';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

export interface Data {
  id: number;
  name: string;
  age: number;
  address: string;
  disabled: boolean;
}

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent implements OnInit {

  // nz -table variant
  checked = false;
  loading = false;
  indeterminate = false;
  listOfData: Data[] = [];
  listOfCurrentPageData: Data[] = [];
  setOfCheckedId = new Set<number>();


  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;
  //param
  private sub?: Subscription;
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;
  private subDataThree?: Subscription;
  private subDataFour?: Subscription;
  private subDataFive?: Subscription;
  // Store Product
  id: string = null;
  product: Product = null;

  chooseImage?: string[] = [];
  checkedVariantImgIndex:number[] = []

  dataForm?: FormGroup;
  modules = null;
  files: File[] = [];
  editorData: any;
  description: any;
  hasLink = false;
  checkedPhysical = true;
  autoSlug = true;
  hasTax = false;
  canPartialPayment = false;
  canReturn = false;
  canEarnPoints = false;
  canRedeemPoints = false;
  hasVariant = false;
  totalQuantity = 0;

  trackQuantity = false;

  downloadUrls: string[] = [];
  // Destroy Session
  needSessionDestroy = true;

  // category
  categories = null;
  subCategories = null;
  public filteredCountryList: Country[];
  public filteredVendorList: Vendor[];
  public filteredBrandList: Brand[];
  public filteredCatList: Category[];
  public filteredSubCatList: SubCategory[];
  //variants
  variantObject = [];
  variantDataArray: any;
  variantDataFormArray: FormArray;
  mediaArray: FormArray;
  variantArray: FormArray;
  optionsArray: FormArray;
  inputVisible = false;
  inputValue = '';
  @ViewChild('inputElement', { static: false }) inputElement?: ElementRef;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  fruits: any[][] = [[]];
  tags: any[] = [];
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  productStatus: Select[] = [
    { value: ProductStatus.DRAFT, viewValue: 'Draft' },
    { value: ProductStatus.ACTIVE, viewValue: 'Active' },
  ];

  selectedOption: ProductStatus = 1;

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
  brands: Brand[] = [];
  vendors: Vendor[] = [];
  countrys: Country[] = [];
  htmlData: any;
  editHtmlData: any;
  showHtmlEditor: boolean = false;

  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];

  listOfTypes: ProductType[] = [];
  listOfSelectedValue = [];
  compareFn = (o1: any, o2: any) => (o1 && o2 ? o1._id === o2._id : o1 === o2);
  imgBlob: any;
  newFileName: string;
  imageChangedEvent: any;
  url: string;
  selectedFolder: any = 'products';


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private countryService: CountryService,
    private brandService: BrandService,
    private vendorService: VendorService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private reloadService: ReloadService,
    private categoryService: CategoryService,
    private productTypeService: ProductTypeService,
    private subCategoryService: SubCategoryService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private router: Router,
    private msg: NzMessageService,
    private modal: NzModalService
  ) {
    // angulartics2GoogleAnalytics.startTracking();
  }

  ngOnInit(): void {
    this.spinner.show();

    // INIT FORM
    this.initModule();
    this.initFormGroup();
    // this.initOptions();

    // Category

    this.getAllProductTypes();
    this.getCountrys();
    this.getBrands();
    this.getVendors();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleProductById();
      }
    });

    // Auto Generate Slug, title, description
    this.autoGenerateSlug();
    this.autoGenerateSeoTitle();
    // this.autoGenerateSeoDescription();

    // reload
    this.reloadService.refreshProduct$.subscribe(() => {
      this.getSingleProductById();
    });


  }

  onRefresh(){
    this.getAllProductTypes();
    this.getCountrys();
    this.getBrands();
    this.getVendors();
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      brand: [null],
      description: [null],
      medias: new FormArray([new FormControl(null)]),
      status: [null, Validators.required],
      isDraft: [null],
      isActive: [null],
      isStockOut: [null],
      isReOrder: [null],
      isPreOrder: [null],
      canReturn: [null],
      returnPeriod: [null],
      canPartialPayment: [null],
      partialPaymentType: [null],
      partialPayment: [null],
      canEarnPoints: [null, Validators.required],
      earnPointsType: [null],
      earnPoints: [null],
      canRedeemPoints: [null, Validators.required],
      redeemPointsType: [null],
      redeemPoints: [null],
      vendor: [null, Validators.required],
      productType: [null, Validators.required],
      tags: [null, Validators.required],
      costPrice: [0],
      wholeSalePrice: [0],
      sellingPrice: [0],
      hasTax: [false, Validators.required],
      tax: [0],
      sku: [null, Validators.required],
      barcode: [null],
      quantity: [0],
      committedQuantity: [0],
      reOrder: [ 5, Validators.required],
      trackQuantity: this.trackQuantity,
      continueSelling: [false],
      isPhysicalProduct: [false],
      weight: [1, Validators.required],
      country: [null, Validators.required],
      hasVariant: [false],
      variants: new FormArray([new FormControl('')]),
      options: new FormArray([new FormControl(null)]),
      variantFormArray: this.fb.array([]),
      variantDataArray: [null],
      searchPageTitle: [null],
      searchPageDescription: [null],
      searchPageUrl: [null],
      sizeChartImageLink: [null],
      link: [null]
    });

    this.variantArray = this.dataForm.get('variants') as FormArray;
    this.optionsArray = this.dataForm.get('options') as FormArray;
    this.variantDataFormArray = this.dataForm.get(
      'variantFormArray'
    ) as FormArray;
    this.mediaArray = this.dataForm.get(
      'medias'
    ) as FormArray;
  }

  /**
   * INIT Quill
   */

   private async initModule() {
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
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // Product Add
  addProduct(data: any) {
    this.productService.addSingleProduct(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        // this.templateForm.resetForm();
        this.spinner.hide();
        // this.reloadService.needRefreshProduct$;
        // this.router.navigate(['admin/products']);
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
        this.uiService.warn(error.error.message);
      }
    );
  }

  //Product Delete
  deleteProduct(){
    this.spinner.show();
    this.productService.deleteProductById(this.product._id).subscribe(
      (res) => {
        this.msg.create('success', res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
        this.reloadService.needRefreshProduct$;
        this.router.navigate(['admin/products']);
      },
      (error) => {
        this.spinner.hide();
        this.uiService.warn('Error :');
      }
    );
  }

  //Product Edit
  editProductData(product: Product) {
    this.productService.editProductById(product).subscribe(
      (res) => {
        this.spinner.hide();
        this.msg.create('success', res.message);
        this.storageService.removeSessionData('PRODUCT_INPUT');
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  getAllProductTypes() {
    this.productTypeService.getAll().subscribe((res) => {
      this.listOfTypes = res.data;
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }


  // Get brands

  getBrands() {
    this.brandService.getAll().subscribe((res) => {
      this.brands = res.data;
      this.filteredBrandList = this.brands.slice();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  // get vendors
  getVendors() {
    this.vendorService.getAll().subscribe((res) => {
      this.vendors = res.data;
      this.filteredVendorList = this.vendors.slice();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  // get countrys
  getCountrys() {
    this.countryService.getAll().subscribe((res) => {
      this.countrys = res.data;
      this.filteredCountryList = this.countrys.slice();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }


  /**
   * Http req ends here
   */

  /**
   * Variant Fuctions
   */

  // variantDataArray creation
  public addVariants(option, variant) {
    this.variantObject = variant;

    let options = [];
    for (let i = 0; i < variant.length; i++) {
      options[i] = { [variant[i]]: option[i].split(',') };
    }

    let output = [];

    let keyArr = [];
    let valueArr = [];

    for (let i = 0; i < options.length; i++) {
      let key = Object.keys(options[i]);
      let values = Object.values(options[i]);

      keyArr.push(key[0]);
      valueArr.push(values[0]);
    }

    function detectCombinations(options, output, position, path) {
      if (position == null) {
        position = 0;
      }
      if (path == null) {
        path = [];
      }
      if (position < options.length) {
        var item = options[position];
        for (var i = 0; i < item.length; ++i) {
          var value = item[i];
          path.push(value);
          detectCombinations(options, output, position + 1, path);
          path.pop();
        }
      } else {
        output.push(path.slice());
      }
    }

    detectCombinations(valueArr, output, null, null);

    let objArr = [];

    for (let i = 0; i < output.length; i++) {
      let obj = {};
      for (let j = 0; j < keyArr.length; j++) {
        obj[keyArr[j]] = output[i][j];
      }
      objArr.push(obj);
    }

    this.variantDataArray = objArr;
    this.dataForm.value.variantDataArray = null;
    this.dataForm.value.variantDataArray = objArr;
  }

  // Variant Form Array
  variantFormArrayFunctionForEdit() {
    // for variant edit
    if (this.id) {
      for (let i = 0; i < this.variantDataArray.length; i++) {
        const f = this.fb.group({
          variantVendorName: this.product.variantFormArray[i].vendor,
          variantQuantity: this.product.variantFormArray[i].quantity,
          variantCostPrice: this.product.variantFormArray[i].variantCostPrice ? this.product.variantFormArray[i].variantCostPrice : 0,
          variantCommittedQuantity: this.product.variantFormArray[i].variantCommittedQuantity ? this.product.variantFormArray[i].variantCommittedQuantity : 0,
          variantReOrder: this.product.variantFormArray[i].reOrder,
          variantContinueSelling: this.product.variantFormArray[i].continueSelling,
          variantDisplay: this.product.variantFormArray[i].variantDisplay,
          variantStatus: this.product.variantFormArray.status,
          variantPrice: this.product.variantFormArray[i].price,
          image: this.product.variantFormArray[i].image,
          variantSku: this.generateSubSku(
            this.product.sku,
            this.product.variants,
            this.product.options,
            this.variantDataArray[i]
          ),
        });
        (this.dataForm?.get('variantFormArray') as FormArray).push(f);
      }
    }
  }

  //for variant add
  variantFormArrayFunctionForAdd(options? : any) {
    for (let i = 0; i < this.variantDataArray.length; i++) {
      const f = this.fb.group({
        variantVendorName: this.dataForm.value.vendor,
        variantQuantity: [0, Validators.required],
        variantReOrder: this.dataForm.value.reOrder,
        variantContinueSelling: [true],
        variantDisplay: [true],
        variantPrice: this.dataForm.value.sellingPrice,
        variantStatus: this.dataForm.value.status,
        image:[null],
        variantSku: this.generateSubSku(
          this.dataForm.value.sku,
          this.dataForm.value.variants,
          options ? options : this.dataForm.value.options,
          this.variantDataArray[i]
          ),
        });
        (this.dataForm?.get('variantFormArray') as FormArray).push(f);
      }
  }

  // Auto generate Sku for varaints
  private generateSubSku(sku, variants, values, array) {
    let subSku = sku + '-';
    let options = [];
    for (let i = 0; i < variants.length; i++) {
      // subSku += variants[i].charAt(0);
      options[i] = values[i].split(',');
      for (let x = 0; options[i].length; x++) {
        if (options[i][x] === array[variants[i]]) {
          subSku += x;
          break;
        }
      }
    }
    return subSku;
  }

  /**
   * Auto Generate Fuctions
   */

  // auto slug
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm
        .get('name')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, '-')
            .toLowerCase();
          this.dataForm.patchValue({
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

  // auto seo title
  autoGenerateSeoTitle() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm
        .get('name')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, ' ')
            // .toLowerCase();
          this.dataForm.patchValue({
            searchPageTitle: res,
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  // auto seo description
  autoGenerateSeoDescription() {
      this.sub = this.dataForm
        .get('description')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, ' ')
            // .toLowerCase();
          this.dataForm.patchValue({
            searchPageDescription: res,
          });
        });
  }

  //Auto Quantity
  totalQuantityCalculation(){
    this.totalQuantity = 0;
    for(let i=0; i< this.product.variantFormArray.length; i++){
      if(this.product){
        this.totalQuantity += this.product.variantFormArray[i].variantQuantity;
      }
    }
  }

  // Submit Variant Form by Done Button

  submitVariant() {
    if (this.dataForm.value.sku === null ) {
      this.uiService.warn('Please input the product sku first');
      return
    } else if (this.id){
      let length = this.dataForm.value.variantFormArray.length;
      for(let i=0; i< length; i++){
        this.removeVariantFormArray(0);
      }
      let options = this.separateOptions();
      this.addVariants(options,this.dataForm.value.variants);
      this.variantFormArrayFunctionForAdd(options);
    } else{

      let options = this.separateOptions();
      this.addVariants(this.dataForm.value.options,this.dataForm.value.variants);
      this.variantFormArrayFunctionForAdd(options);

    }
  }
  separateOptions() {
    let options : string[] = [];
      for(let i = 0; i< this.fruits.length; i++){
        let optionName : string;
        for(let j=0; j < this.fruits[i].length; j++){
          if(j===0){
            optionName = this.fruits[i][j];
          }else{
            optionName += ','+ this.fruits[i][j];
          }
        }
        options.push(optionName);
        this.dataForm.value.options[i]=optionName;
      }
      return options;
  }


  //remove variant from variant form array
  removeVariantFormArray(index){
    (this.dataForm.get('variantFormArray') as FormArray).removeAt(index);
  }



  // Form Control Array

   onAddNewFormControl() {
    const form = new FormControl('');
    const form2 = new FormControl('');
    (this.dataForm.controls['variants'] as FormArray).push(form);
    (this.dataForm.controls['options'] as FormArray).push(form2);
    this.fruits.push([]);
  }

  deleteFormControl(index) {
    (this.dataForm.controls['variants'] as FormArray).removeAt(index);
    (this.dataForm.controls['options'] as FormArray).removeAt(index);
  }

  //remove media
  deleteMediaFormControl(index) {
    (this.dataForm.controls['medias'] as FormArray).removeAt(index);
  }

  addMediaLinkButton() {
    const form = new FormControl('');
    (this.dataForm.controls['medias'] as FormArray).push(form);
  }

  /**
   * Patch Form Data
   */

  // for editing product
  private patchFormData() {

    // for (let i = 0; i < this.product.productType.length; i++) {
    //   this.listOfSelectedValue.push(this.product.productType[i]);
    // }
    // console.log(this.listOfSelectedValue);
    this.chooseImage = this.product.images;
    //for medias
    for (let i = 0; i < this.product.medias.length - 1; i++) {
      this.addMediaLinkButton();
    }

    //for tax
    if(this.product.tax > 0){
      this.hasTax = true;
    }

    //for variants
    if(this.product.hasVariant === true){

      this.addVariants(this.product.options, this.product.variants);
      this.variantFormArrayFunctionForEdit();
      this.dataForm.value.variantDataArray = this.product.variantDataArray;

      for (let i = 0; i < this.product.options.length; i++) {
        if((i+1) !== this.product.options.length){
          this.onAddNewFormControl();
        }
        this.dataForm.value.options[i] = null;

        this.fruits[i]= this.product.options[i].split(',')
      }
      console.log("For Patch",this.product)
      this.dataForm.patchValue(this.product);
    }
    else{
      this.dataForm.patchValue(this.product);
    }
  }

  private patchByImport(data){
    //for medias
    for (let i = 0; i < data.images?.length - 1; i++) {
      this.addMediaLinkButton();
    }
    if(data.variants?.length > 0){
      for (let i = 0; i < data.variants?.length - 1; i++) {
        this.onAddNewFormControl();
      }
    }
    // this.addVariants(data.options, data.variants);
    if(data.images?.length > 0){
      this.hasLink = true;
    }
    this.dataForm.patchValue(
      {
        name: data.name,
        // description: data.description ? data.description : this.getProductDescription(data.descriptionUrl),
        medias: data.images,
        variants: data.variants,
        options: data.options,
        hasVariant: data.variants?.length > 0 ? true : false,
        brand: data.brand
      }
    )
  }
  getProductDescription(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText
  }

  /**
   * Submit Product Form
   */

  onSubmit() {
    this.spinner.show();
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      this.spinner.hide();
      return;
    }
    this.description = this.dataForm.value.description;
    this.dataForm.value.variantDataArray = this.variantDataArray;
    this.dataForm.value.images = this.chooseImage;
    this.dataForm.value.isStockOut = false;
    this.dataForm.value.hasLink = false;
    const rawData = this.dataForm.value;
    if(this.dataForm.value.quantity === 0){
      this.dataForm.value.isStockOut = true;
    }

    if(this.dataForm.value.hasVariant){
      for(let i = 0; i< this.dataForm.value.variantFormArray.length; i++){
        if(this.dataForm.value.variantFormArray[i].variantQuantity === 0){
          this.dataForm.value.isStockOut = true;
        }
      }
    }

    this.dataForm.value.isReOrder = false;
    if(this.dataForm.value.reOrder >= this.dataForm.value.quantity){
      this.dataForm.value.isReOrder = true;
    }
    if(this.dataForm.value.reOrder === 0){
      this.dataForm.value.isReOrder = false;
    }
    if(this.dataForm.value.hasVariant){
      for(let i = 0; i< this.dataForm.value.variantFormArray.length; i++){
        if(this.dataForm.value.variantFormArray[i].variantReOrder !==0 && this.dataForm.value.variantFormArray[i].variantReOrder >= this.dataForm.value.variantFormArray[i].variantQuantity){
          this.dataForm.value.isReOrder = true;
        }
      }
    }

    this.dataForm.value.isPreOrder = this.dataForm.value.continueSelling;
    if(this.dataForm.value.hasVariant){
      for(let i = 0; i< this.dataForm.value.variantFormArray.length; i++){
        if(this.dataForm.value.variantFormArray[i].variantContinueSelling){
          this.dataForm.value.isPreOrder = true;
        }
      }
    }

    if (this.product) {
      const finalData = {
        ...rawData,
        ...{ _id: this.product._id }
      };
      this.editProductData(finalData);
    } else {
      this.addProduct(rawData);
    }
  }

//   public findInvalidControls() {
//     const invalid = [];
//     const controls = this.dataForm.controls;
//     for (const name in controls) {
//         if (controls[name].invalid) {
//             invalid.push(name);
//         }
//     }
//     return invalid;
// }

  /**
   * Image Functionalities
   */

  // // Drag and drop
  // onSelect(event) {
  //   this.files.push(...event.addedFiles);
  //   this.onUploadImages();
  // }

  // onRemove(event) {
  //   this.files.splice(this.files.indexOf(event), 1);
  // }

  // Toggle add media link
  toggleLink() {
    this.hasLink = !this.hasLink;
  }

  /**
   * Quantity required
   */

  makeQuantityRequired() {
    this.trackQuantity = !this.trackQuantity;
  }

  /**
   * selection change
   */


  /**
   * Product Archive Button
   */
  archive() {
    this.product.status = 4;
    this.editProductData(this.product);
    this.reloadService.needRefreshProduct$;
  }
  // preview() {
  //  this.router.navigate(['product-details/' + this.product.slug])
  // }
  preview() {
    window.open('product-details/' + this.product.slug)
  //  this.router.navigate()
  }

  onCheckVariantImage(event: MatCheckboxChange, i:number) {
    if (event.checked) {
     this.checkedVariantImgIndex.push(i);
    } else {
      const fIndex = this.checkedVariantImgIndex.findIndex(h => h === i);
      this.checkedVariantImgIndex.splice(fIndex, 1)
    }
  }

  checkSelectionVariantImg(index: number) {
    const hasIndex = this.checkedVariantImgIndex.findIndex(f => f === index);
    return hasIndex >= 0;

  }

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

  onEditHtmlEditor(){
    this.htmlData = this.dataForm.value.description;
    this.showHtmlEditor = !this.showHtmlEditor;
  }

  onInput(event: Event){
    const data = (event.target as HTMLInputElement).value;
    this.dataForm.patchValue(
      {
        name : 'Saniul',
        description : data
      }
    )
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
  /**
   * Image Gallery
   */

  /**
   * OPEN COMPONENT DIALOG
   */

   public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: true,
      width: '600px',
      minHeight: '400px',
      maxHeight: '600px'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.imgBlob) {
          this.imgBlob = dialogResult.imgBlob;
        }
        if (dialogResult.croppedImage) {
          // this.pickedImage = dialogResult.croppedImage;
          // this.imgPlaceHolder = this.pickedImage;
          this.imageUploadOnServer();
        }
      }
    });
  }

  imageUploadOnServer() {

    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'products'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
      }, error => {
        console.log(error);
      });
  }

  removeVariationImage(i: number) {
    this.variantDataFormArray.at(i).patchValue({image: null})
  }


  /**
   * GET IMAGE DATA FROM STATE
   */
  private getPickedImages(images: ImageGallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }

  /**
   * DUG & DROP IMAGE REARRANGE
   */

   drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }

  /**
   * REMOVE SELECTED IMAGE
   */
   removeSelectImage(s: string) {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">Click on the save button to update</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const index = this.chooseImage.findIndex(x => x === s);
        this.chooseImage.splice(index, 1);
        this.msg.create('success', 'image removed from list');
      },
      nzCancelText: 'No',
      nzOnCancel: () => {
        this.msg.create('warning', 'image is not deleted');
      }
    });

  }


  /**
   * ON HOLD INPUT DATA
   */

   onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'BLOG_INPUT');
  }

  importProductInfo(){

    let baseurl = new URL(this.dataForm.value.link).hostname;
    this.spinner.show();
      if (baseurl==="www.aliexpress.com"){
        let link = this.dataForm.value.link.split('/');
        let productCode = link[4].split('.html')[0];
        this.productService.getAliexpressProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            let data = res.data;
            this.patchByImport(data);

          },(err)=>{
            this.spinner.hide();
          }
        )
      }
      if (baseurl==="www.amazon.com"){
        let link = this.dataForm.value.link.split('/');
        let productCode = link[5];
        this.productService.getAmazonProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            let data = res.data;
            this.patchByImport(data);

          },(err)=>{
            this.spinner.hide();
            console.log(err);
          }
        )
      }
      if (baseurl==="www.amazon.in"){
        let link = this.dataForm.value.link.split('/');
        let productCode = link[4];
        this.productService.getAmazonIndiaProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            let data = res.data;
            this.patchByImport(data);

          },(err)=>{
            this.spinner.hide();
            console.log(err);
          }
        )
      }
      if (baseurl==="www.walmart.com"){
        let link = this.dataForm.value.link.split('/');
        let productCode = link[5];
        this.productService.getWalmartProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            let data = res.data;
            this.patchByImport(data);

          },(err)=>{
            this.spinner.hide();
            console.log(err);
          }
        )
      }


  }

  add(event: MatChipInputEvent, index:number): void {
    const value = (event.value || '').trim();
    // Add our fruit
    if (value) {
      this.fruits[index].push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(fruit: any, i): void {
    const index = this.fruits[i].indexOf(fruit);

    if (index >= 0) {
      this.fruits[i].splice(index, 1);
    }
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
      this.dataForm.value.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
      this.dataForm.value.tags.splice(index, 1);
    }
  }

  onSelect(event: { addedFiles: any; }) {
    this.files.push(...event.addedFiles);
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  onUploadImages() {
    if (!this.files || this.files.length <= 0) {
      this.uiService.warn('No Image selected!');
      return;
    }
    this.fileUploadService.uploadMultiImageOriginal(this.files)
      .subscribe(res => {
        this.downloadUrls = res.downloadUrls;
        this.downloadUrls.forEach( m => {
          this.chooseImage.push(m)
        })
        this.files = [];
        this.msg.create('success', res.message);
      }, error => {
        console.log(error);
      });
  }


}
