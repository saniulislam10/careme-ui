import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductType } from 'src/app/interfaces/product-type';
import { AdminService } from 'src/app/services/admin.service';
import { ProductTypeService } from 'src/app/services/product-type.service';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'app-product-type',
  templateUrl: './product-type.component.html',
  styleUrls: ['./product-type.component.scss']
})
export class ProductTypeComponent implements OnInit {


  createProductType = false;
  editProductTypeData = false;
  dataForm: FormGroup;
  productTypes: ProductType[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: ProductType[];
  searchProductTypes: any[];
  isLoading: boolean;
  searchInput: any;
  isFocused: any;
  isOpen: boolean;
  overlay: boolean;

  constructor(
    private fb : FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private productTypeService: ProductTypeService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshProductTypes$
      .subscribe(() => {
        this.getAllProductTypes();
      });
    this.getAllProductTypes();

    if(this.createProductType){
      this.initModule();
    }
  }
  getAllProductTypes() {
    this.subRouteOne = this.productTypeService.getAll()
    .subscribe( res => {
      this.productTypes = res.data;
      console.log(this.productTypes);
      this.holdPrevData = this.productTypes;
    }, err => {
      console.log(err);
      this.message.create('error', err.error.message);
    })
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      logo: [null],
    });
  }
  /***
   * Control Create Vendor
   */
  hideCreate(){
    this.createProductType = false;
    this.id = null;
    this.editProductTypeData = false;
  }
  showCreate(){
    this.editProductTypeData = false;
    this.createProductType = true;
    this.initModule();
  }

  onSubmit(){
    let productType = {
      name: this.dataForm.value.name,
    }
    console.log(this.id);
    if(this.id && this.editProductTypeData){
      let finaldata = {...productType, ...{_id: this.id}};
      console.log(finaldata);
      this.editProductType(finaldata);
    }
    else if(this.dataForm.invalid){
      this.message.create('warning', 'Please input the required fields');
      return
    }
    else{
      this.addProductType(productType);
    }
  }


  editProductType(data : ProductType){
    this.productTypeService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshProductTypes$();
        this.createProductType = false;

      }, err => {
        this.message.create('error', err.error.message);
      })
  }

  addProductType(data : ProductType){
    this.productTypeService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshProductTypes$();
      }, err => {
        this.message.create('error', err.error.messase);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createProductType = true;
    this.editProductTypeData = true;
    this.dataForm.patchValue(data);
  }

  ngOnDestroy(){
    this.subRouteOne.unsubscribe();
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
          this.searchQuery = data.trim();

          if (this.searchQuery) {
            return this.productTypeService.getSearchProductTypes(this.searchQuery);
          } else {
            this.productTypes = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchProductTypes = res.data;
          this.productTypes = this.searchProductTypes;
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProductTypes.length > 0) {
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
    if (this.searchProductTypes.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProductTypes = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

}
