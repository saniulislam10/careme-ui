import { Subscription } from 'rxjs/internal/Subscription';
import { VendorService } from './../../../services/vendor.service';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from 'src/app/services/admin.service';
import { Vendor } from 'src/app/interfaces/vendor';
import { ReloadService } from 'src/app/services/reload.service';
import { debounceTime, distinctUntilChanged, pluck, switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Pagination } from 'swiper';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.scss']
})
export class VendorComponent implements OnInit, OnDestroy {

  createVendor = false;
  editVendorData = false;
  passwordVisible = false;
  confirmPasswordVisible = false;
  dataForm: FormGroup;
  vendors: Vendor[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: Vendor[];
  searchVendors: any[];
  isLoading: boolean;
  searchInput: any;
  isFocused: any;
  isOpen: boolean;
  overlay: boolean;

  constructor(
    private fb : FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private vendorService: VendorService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshVendors$
      .subscribe(() => {
        this.getAllVendors();
      });
    this.getAllVendors();

    if(this.createVendor){
      this.initModule();
    }
  }
  getAllVendors() {
    this.subRouteOne = this.vendorService.getAll()
    .subscribe( res => {
      this.vendors = res.data;
      this.holdPrevData = this.vendors;
    }, err => {
      console.log(err);
      this.message.create('error', err.error.message);
    })
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      username: [null, Validators.required],
      email: [null, Validators.email],
      address: [null],
      phoneNo: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
    });
  }
  /***
   * Control Create Vendor
   */
  hideCreateVendor(){
    this.createVendor = false;
    this.id = null;
    this.editVendorData = false;
  }
  showCreateVendor(){
    this.createVendor = true;
    this.initModule();
  }

  onSubmit(){
    let vendor = {
      name: this.dataForm.value.name,
      username: this.dataForm.value.username,
      email: this.dataForm.value.email,
      phoneNo: this.dataForm.value.phoneNo,
      password: this.dataForm.value.password,
      address: this.dataForm.value.address,
      role: 'VENDOR',
      hasAccess: true
    }
    console.log(this.id);
    if(this.id){
      let finaldata = {...vendor, ...{_id: this.id}};
      console.log(finaldata);
      this.editVendor(finaldata);
    }
    else if(this.dataForm.invalid){
      this.message.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.message.create('warning', 'Password Mismatch');
      return
    }else{
      this.addVendor(vendor);
    }
  }


  editVendor(data){
    this.vendorService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshVendors$;
        this.createVendor = false;

      }, err => {
        this.message.create('error', err.error.message);
      })
  }

  addVendor(data){
    this.adminService.adminRegistration(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshVendors$;
      }, err => {
        this.message.create('error', err);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createVendor = true;
    this.editVendorData = true;
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
          console.log(data);
          this.searchQuery = data.trim();
          console.log(this.searchQuery);
          if (this.searchQuery) {
            return this.vendorService.getSearchVendors(this.searchQuery);
          } else {
            this.vendors = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchVendors = res.data;
          this.vendors = this.searchVendors;
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
    if (this.searchVendors.length > 0) {
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
    if (this.searchVendors.length > 0) {
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
    this.searchVendors = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }


}
