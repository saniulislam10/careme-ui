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


//for quill
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
Quill.register('modules/blotFormatter', BlotFormatter);

import { Country } from '@angular-material-extensions/select-country';
import { Product } from 'src/app/interfaces/product';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { AmountType } from 'src/app/enum/amount-type';
import { Subscription, Subject, Observable } from 'rxjs';
import { Weight } from 'src/app/enum/weight';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { ReloadService } from 'src/app/services/reload.service';
import { CategoryService } from 'src/app/services/category.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { MatSelectChange } from '@angular/material/select';
import { SizeChartComponent } from '../../size-chart/size-chart.component';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ImageGalleryDialogComponent } from '../../image-gallery-dialog/image-gallery-dialog.component';
import { ImageGallery } from 'src/app/interfaces/image-gallery';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from 'src/app/services/utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Category } from 'src/app/interfaces/category';
import { SubCategory } from 'src/app/interfaces/sub-category';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { colorSets } from '@swimlane/ngx-charts';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.scss'],
})
export class AddNewProductComponent implements OnInit {
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
  checked = true;
  autoSlug = true;
  hasTax = false;
  canPartialPayment = false;
  canReturn = false;
  canEarnPoints = false;
  canRedeemPoints = false;
  hasVariant = false;
  totalQuantity = 0;

  trackQuantity = false;

  downloadUrls: any;
  // Destroy Session
  needSessionDestroy = true;

  // category
  categories = null;
  subCategories = null;
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
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;


  productStatus: Select[] = [
    { value: ProductStatus.DRAFT, viewValue: 'Draft' },
    { value: ProductStatus.ACTIVE, viewValue: 'Active' },
    // { value: ProductStatus.INACTIVE, viewValue: 'Inactive' },
    // { value: ProductStatus.ARCHIVED, viewValue: 'Archived' },
    // { value: ProductStatus.STOCKOUT, viewValue: 'Stock Out' },
    // { value: ProductStatus.REORDER, viewValue: 'Re-Order' },
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


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private reloadService: ReloadService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private utilsService: UtilsService,
    private router: Router,
  ) {
    // angulartics2GoogleAnalytics.startTracking();
  }

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();
    this.initModule();
    // this.initOptions();

    // Category

    this.getAllCategories();

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
      parentCategory: [null, Validators.required], // object ***
      childCategory: [null, Validators.required], // object ***
      tags: [null],
      costPrice: [null, Validators.required],
      wholeSalePrice: [null],
      sellingPrice: [null, Validators.required],
      hasTax: [null, Validators.required],
      tax: [null],
      sku: [null, Validators.required],
      barcode: [null],
      quantity: [null],
      committedQuantity: [0],
      reOrder: [null, Validators.required],
      trackQuantity: this.trackQuantity,
      continueSelling: [null],
      isPhysicalProduct: [null],
      weight: [null, Validators.required],
      weightType: [null, Validators.required],
      country: [null, Validators.required],
      hscode: [null],
      hasVariant: [null],
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

  // private initOptions(){
  //   for(let i=0; i<this.variantArray.length; i++){
  //       this.filteredOptions = this.variantArray[i].valueChanges.pipe(
  //         startWith(''),
  //         map(value => this._filter(value || '')),
  //       );
  //     }
  // }
  // private _filter(value): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this.options.filter(option => option.toLowerCase().includes(filterValue));
  // }

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
        this.uiService.success(res.message);
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
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PRODUCT_INPUT');
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  // Get categories

  getAllCategories() {
    this.categoryService.getAllCategory().subscribe((res) => {
      this.categories = res.data;
      this.filteredCatList = this.categories.slice();
      this.spinner.hide();
    }, error => {
      console.log(error);
      this.spinner.hide();
    });
  }

  // get sub category

  private getAllSubCategoryByCategoryId(id) {
    console.log("paretn id", id);
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
      console.log(options[i])

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
        variantReOrder: [0],
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
    if (this.dataForm.value.sku === null || this.dataForm.value.vendor === null ) {
      this.uiService.warn('Please complete the sku and vendor first');
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
      console.log(this.fruits);
      for(let i = 0; i< this.fruits.length; i++){
        let optionName : string;
        for(let j=0; j < this.fruits[i].length; j++){
          console.log(this.fruits[j])
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
      this.dataForm.patchValue(this.product);
    }
    else{
      this.dataForm.patchValue(this.product);
    }
  }

  private patchByImport(data){
    console.log(data);
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
      console.log(this.dataForm.value);
      this.uiService.warn('Please complete all the required fields');
      this.spinner.hide();
      return;
    }
    this.description = this.dataForm.value.description;
    this.dataForm.value.variantDataArray = this.variantDataArray;
    const rawData = this.dataForm.value;
    rawData.images = this.chooseImage;
    rawData.hasLink = false;
    this.dataForm.value.isStockOut = false;
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
      console.log(rawData);
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

  onSelectCategory(event: MatSelectChange) {
    this.getAllSubCategoryByCategoryId(event.value);
  }

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
     this.checkedVariantImgIndex.push(i)
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

   public openComponentDialog() {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.getPickedImages(dialogResult.data);
        }
      }
    });
  }

  public openVariationGalleryDialog(index: number) {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {

          if(this.checkedVariantImgIndex.length){
            this.checkedVariantImgIndex.forEach((f)=>{
              this.variantDataFormArray.at(f).patchValue({image: dialogResult.data[0].url});
            });
            this.checkedVariantImgIndex = []
          } else{
            this.variantDataFormArray.at(index).patchValue({image: dialogResult.data[0].url});
          }
        }
      }
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
     console.log(this.chooseImage);
     console.log(event.previousIndex);
     console.log(event.currentIndex);

    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }

  /**
   * REMOVE SELECTED IMAGE
   */
   removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
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
    console.log(baseurl);
    this.spinner.show();
      if (baseurl==="www.aliexpress.com"){
        let link = this.dataForm.value.link.split('/');
        let productCode = link[4].split('.html')[0];
        this.productService.getAliexpressProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            console.log(res.data);
            let data = res.data;
            this.patchByImport(data);

          },(err)=>{
            this.spinner.hide();
            console.log(err);
          }
        )
      }
      if (baseurl==="www.amazon.com"){
        let link = this.dataForm.value.link.split('/');
        console.log(link);
        let productCode = link[5];
        this.productService.getAmazonProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            console.log(res.data);
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
        console.log(link);
        let productCode = link[4];
        this.productService.getAmazonIndiaProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            console.log(res.data);
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
        console.log(link);
        let productCode = link[5];
        this.productService.getWalmartProductInfo(productCode)
        .subscribe(
          (res)=>{
            this.spinner.hide();
            console.log(res.data);
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
    console.log(index);
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



}


