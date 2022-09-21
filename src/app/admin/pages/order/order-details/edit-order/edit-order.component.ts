import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, Subscription } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PaymentStatus } from 'src/app/enum/payment-status';
import { ProductOrderStatus } from 'src/app/enum/product-order-status';
import { Cart } from 'src/app/interfaces/cart';
import { Order } from 'src/app/interfaces/order';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { Select } from 'src/app/interfaces/select';
import { InvoiceService } from 'src/app/services/invoice.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { OrderDetailsComponent } from '../order-details.component';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {
  public dataForm: FormGroup;
  order: Order;

  products: Product[] = [];
  //search
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('searchForm') searchForm: NgForm;
  overlay = false;
  isFocused = false;
  isOpen = false;
  isLoading = false;
  query = null;
  searchProducts: Product[] = [];

  //cart
  // products: any[] = [];

  // calculation
  totalDiscount:number=0;
  totalDeliveryFee:number=0;


  deliveryOptions: Select[] = [
    { viewValue: 'Pathao', value: 'pathao' },
    { viewValue: 'REDX', value: 'redx' },
    { viewValue: 'Sundarban Courier Service', value: 'sundarban-courier' },
    { viewValue: 'SA Paribahan', value: 'sa-paribahan' },
  ];

  constructor(
    public fb: FormBuilder,
    public orderService: OrderService,
    public uiService: UiService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<EditOrderComponent>,
    private productService: ProductService,
    private userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.order = this.data;
    // INIT FORM
    this.initFormGroup();
    this.patchValues();
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

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      fullName: [null, Validators.required],
      email: [null],
      phoneNo: [null, Validators.required],
      shippingAddress: [null, Validators.required],
      deliveryOption: [null, Validators.required],
      message: [null, Validators.required],
      deliveryStatus: [null],
      quantity: [null],
    });
  }

  onSubmitForm(){
    console.log(this.dataForm.value);
    this.order.name = this.dataForm.value.fullName;
    this.order.phoneNo = this.dataForm.value.phoneNo;
    this.order.email = this.dataForm.value.email;
    this.order.shippingAddress = this.dataForm.value.shippingAddress;
    this.order.orderNotes = this.dataForm.value.message;
    this.order.orderedItems = this.products;

    this.orderService.editOrder(this.order)
    .subscribe(res => {
      this.uiService.success("Order edited successfully");
    },err => {
      this.uiService.warn("Couldn't edit order");
    })

  }


  patchValues() {
    // this.dataForm.patchValue(this.order);
    this.dataForm.patchValue({
      fullName: this.order?.name,
      phoneNo: this.order?.phoneNo,
      email: this.order.email,
      shippingAddress: this.order?.shippingAddress,
      message: this.order?.orderNotes
    });
    this.products = this.order.orderedItems;
    console.log(this.products);
  }

  /**
   *Calculation
   */

   handleDeliveryChange(value:number){
    this.totalDeliveryFee=value;
  }

  handleDiscountChange(value:number){
    this.totalDiscount=value;
  }

  get cartSubtotal() {
    let total:number=0;
    this.products.map(e=>{
      const eTotal=this.getTotal(e);
      total=total+eTotal;
    })
    total=total+this.totalDeliveryFee*1;
    total=total-this.totalDiscount;
    return total;

  }

  getTotal(data){
    return data.quantity*data.product.sellingPrice;
  }

  onSelectItem(data: Product): void {
    console.log("Selected Product Data",data);
    let newProduct = {
      orderType: "regular",
      price: data.sellingPrice,
      product: data._id,
      quantity: 1,
      sku: data.sku,
      status: 0,
      tax: data.hasTax ? data.tax : 0
    }
    // this.products.push(newProduct);
    console.log(this.products);
    this.cartSubtotal;
    this.handleCloseAndClear();
  }

  incrementQty(i){
    this.products[i].quantity += 1;
  }

  decrementQty(i){
    this.products[i].quantity -= 1;
  }

  /* SEARCH */

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

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
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


  calculateSubTotal(){
    let total = 0;
    for(let i=0; i<this.products.length; i++){
      total += this.getAmount(this.products[i]);
    }
    return total;
  }
  getAmount(item){
    return Math.round((item?.price* item?.quantity + item.tax* item?.quantity) )
  }

  getDeliveryFee(){
    return 0;
  }
}
