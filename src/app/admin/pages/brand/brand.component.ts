import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Brand } from 'src/app/interfaces/brand';
import { AdminService } from 'src/app/services/admin.service';
import { BrandService } from 'src/app/services/brand.service';
import { ReloadService } from 'src/app/services/reload.service';
import { VendorService } from 'src/app/services/vendor.service';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  createBrand = false;
  editBrandData = false;
  dataForm: FormGroup;
  brands: Brand[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: Brand[];
  searchBrands: any[];
  isLoading: boolean;
  searchInput: any;
  isFocused: any;
  isOpen: boolean;
  overlay: boolean;

  constructor(
    private fb : FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private brandService: BrandService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshBrands$
      .subscribe(() => {
        this.getAllBrands();
      });
    this.getAllBrands();

    if(this.createBrand){
      this.initModule();
    }
  }
  getAllBrands() {
    this.subRouteOne = this.brandService.getAll()
    .subscribe( res => {
      this.brands = res.data;
      console.log(this.brands);
      this.holdPrevData = this.brands;
    }, err => {
      console.log(err);
      this.message.create('error', err.error.message);
    })
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      link: [null, Validators.required],
      logo: [null],
    });
  }
  /***
   * Control Create Vendor
   */
  hideCreate(){
    this.createBrand = false;
    this.id = null;
    this.editBrandData = false;
  }
  showCreate(){
    this.editBrandData = false;
    this.createBrand = true;
    this.initModule();
  }

  onSubmit(){
    let brand = {
      name: this.dataForm.value.name,
      link: this.dataForm.value.link,
    }
    console.log(this.id);
    if(this.id && this.editBrandData){
      let finaldata = {...brand, ...{_id: this.id}};
      console.log(finaldata);
      this.editBrand(finaldata);
    }
    else if(this.dataForm.invalid){
      this.message.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.message.create('warning', 'Password Mismatch');
      return
    }else{
      this.addBrand(brand);
    }
  }


  editBrand(data : Brand){
    this.brandService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshBrands$();
        this.createBrand = false;

      }, err => {
        this.message.create('error', err.error.message);
      })
  }

  addBrand(data : Brand){
    this.brandService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshBrands$();
      }, err => {
        this.message.create('error', err.error.messase);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createBrand = true;
    this.editBrandData = true;
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
            return this.brandService.getSearchBrands(this.searchQuery);
          } else {
            this.brands = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchBrands = res.data;
          this.brands = this.searchBrands;
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
    if (this.searchBrands.length > 0) {
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
    if (this.searchBrands.length > 0) {
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
    this.searchBrands = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

}
