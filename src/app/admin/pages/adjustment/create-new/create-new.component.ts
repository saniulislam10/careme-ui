import { Adjustment } from './../../../../interfaces/adjustment';
import { products } from 'src/app/core/utils/dashboard.data';
import { Purchase } from 'src/app/interfaces/purchase';
import { Pagination } from './../../../../interfaces/pagination';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { EMPTY, Subscription } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';
import { PurchaseService } from 'src/app/services/purchase.service';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ActivatedRoute } from '@angular/router';
import { AdjustmentService } from 'src/app/services/adjustment.service';


@Component({
  selector: 'app-create-new',
  templateUrl: './create-new.component.html',
  styleUrls: ['./create-new.component.scss']
})
export class CreateNewComponent implements OnInit {

  public dataForm: FormGroup;



  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  overlay = false;
  isFocused = false;
  isOpen = false;
  isLoading = false;
  query = null;
  searchProducts: Product[] = [];
  clickActive: any[] = [[]];

  private subRouteOne?: Subscription;
  // purchasedProducts: any[] = [];
  public date = new Date();
  createInvoice = false;
  id: any;
  order: Order;
  DateToday: Date = new Date()
  canceledOrderSku: string;
  canceledOrderAmount: number;
  selectedIds: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private adjustmentService: AdjustmentService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initFormValue();

  }
  initFormValue() {
    this.dataForm = this.fb.group({
      dateTime: [null],
      reason: [null, Validators.required],
      products: this.fb.array([]),
    });
  }

  get products() : FormArray {
    return this.dataForm.get("products") as FormArray
  }

  newProduct(data): FormGroup {
    return this.fb.group({
      productData: data,
      amount: [0],
      damageQuantity: [1, Validators.required],
      damageAmount: [0]
    })
  }

  addProduct(data) {
      this.products.push(this.newProduct(data));
  }
  removeProduct(i:number) {
    this.products.removeAt(i);
  }

  // submit form
  onSubmit(){
    let data = this.dataForm.value;
    let extraData = {
      dateTime: this.DateToday,
      total: this.calculateSubTotal(),
      status: 0,
    }
    let finalData = {...data, ...extraData};
    console.log("adjustment creating", finalData);
    this.add(finalData);
  }

  add(data){
    this.adjustmentService.add(data)
    .subscribe( res =>{
      this.uiService.success(res.message);
      this.reloadService.needRefreshPurchase$();
    },err=>{
      this.uiService.wrong(err.message);
    })
  }
  edit(data){
    this.adjustmentService.edit(data)
    .subscribe( res =>{
      this.uiService.success(res.message);
      this.reloadService.needRefreshPurchase$();
    },err=>{
      this.uiService.wrong(err.message);
    })
  }

  //close dialog box
  close(){
    console.log("close");
  }
  delete(){
    console.log("delete");
  }

  /**
   *
   * Calculations
   */

  calculateAmount(i){

    let productData = this.products?.value[i]?.productData;

    let purchasePrice = productData.costPrice;
    let tax = Math.round((purchasePrice * (productData.purchaseTax ? productData.purchaseTax : 0))/100);
    let quantity = this.products?.value[i]?.damageQuantity;
    this.products.value[i].damageAmount = (purchasePrice+tax)*quantity;
    return this.products.value[i].damageAmount;
  }

  calculateSubTotal(){
    console.log("Calculate Sub")
    let total = 0;
    this.products.value.forEach(function(element){
      total += element.damageAmount
    });
    return total;
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

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
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
  }

  onSelectItem(data: Product): void {
    console.log(data);
    this.clickActive.push([]);
    this.addProduct(data);
    this.clickActive.push([]);
    this.handleCloseAndClear();
  }
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

  getOptions(option) {
    let variantOptions = option.split(',')
    return variantOptions;
  }

  onSelectVariant(option) {
    console.log(option);
  }

  setSku() {
    for (let i = 0; i < this.products.length; i++) {
      let sku = this.products[i].product.sku + "-";
      for (let x = 0; x < this.clickActive[i].length; x++) {
        sku += this.clickActive[i][x];
      }
      this.products[i].sku = sku;
    }
  }

  selectOption(data){
    console.log(data);
  }




  uploadImage(){
    console.log("Image Up-laoding")
  }

}
