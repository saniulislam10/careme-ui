import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Supplier } from 'src/app/interfaces/supplier';
import { AdminService } from 'src/app/services/admin.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ReloadService } from 'src/app/services/reload.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  createSupplier = false;
  editSupplierData = false;
  dataForm: FormGroup;
  suppliers: Supplier[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: Supplier[];
  searchSuppliers: any[];
  isLoading: boolean;
  searchInput: any;
  isFocused: any;
  isOpen: boolean;
  overlay: boolean;

  constructor(
    private fb : FormBuilder,
    private message: NzMessageService,
    private adminService: AdminService,
    private supplierService: SupplierService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshSuppliers$
      .subscribe(() => {
        this.getAllSuppliers();
      });
    this.getAllSuppliers();

    if(this.createSupplier){
      this.initModule();
    }
  }
  getAllSuppliers() {
    this.subRouteOne = this.supplierService.getAll()
    .subscribe( res => {
      this.suppliers = res.data;
      console.log(this.suppliers);
      this.holdPrevData = this.suppliers;
    }, err => {
      console.log(err);
      this.message.create('error', err.error.message);
    })
  }
  initModule() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      link: [null, Validators.required],
      phoneNo: [null, Validators.required],
      address: [null],
      logo: [null],
    });
  }
  /***
   * Control Create Vendor
   */
  hideCreate(){
    this.createSupplier = false;
    this.id = null;
    this.editSupplierData = false;
  }
  showCreate(){
    this.createSupplier = true;
    this.initModule();
  }

  onSubmit(){
    let supplier = {
      name: this.dataForm.value.name,
      link: this.dataForm.value.link,
      phoneNo: this.dataForm.value.phoneNo,
      address: this.dataForm.value.address
    }
    console.log(this.id);
    if(this.id){
      let finaldata = {...supplier, ...{_id: this.id}};
      console.log(finaldata);
      this.editSupplier(finaldata);
    }
    else if(this.dataForm.invalid){
      this.message.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.message.create('warning', 'Password Mismatch');
      return
    }else{
      this.addSupplier(supplier);
    }
  }


  editSupplier(data : Supplier){
    this.supplierService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.createSupplier = false;
        this.reloadService.needRefreshSuppliers$();

      }, err => {
        this.message.create('error', err.error.message);
      })
  }

  addSupplier(data : Supplier){
    this.supplierService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.message.create('success', res.message);
        this.reloadService.needRefreshSuppliers$();
      }, err => {
        this.message.create('error', err.error.messase);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createSupplier = true;
    this.editSupplierData = true;
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
            return this.supplierService.getSearchSuppliers(this.searchQuery);
          } else {
            this.suppliers = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchSuppliers = res.data;
          this.suppliers = this.searchSuppliers;
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
    if (this.searchSuppliers.length > 0) {
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
    if (this.searchSuppliers.length > 0) {
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
    this.searchSuppliers = [];
    this.isFocused = false;
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }

}
