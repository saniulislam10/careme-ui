import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Brand } from 'src/app/interfaces/brand';
import { FileData } from 'src/app/interfaces/file-data';
import { AdminService } from 'src/app/services/admin.service';
import { BrandService } from 'src/app/services/brand.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ReloadService } from 'src/app/services/reload.service';
import { VendorService } from 'src/app/services/vendor.service';
import { ImageCropperComponent } from 'src/app/shared/components/image-cropper/image-crop.component';

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

  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  pickedImage?: any;
  imgPlaceHolder = '/assets/svg/user.svg';
  imageChangedEvent: any = null;
  url: string;

  constructor(
    private fb : FormBuilder,
    private msg: NzMessageService,
    private adminService: AdminService,
    private brandService: BrandService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private modal: NzModalService
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
      this.msg.create('error', err.error.message);
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
    this.url = null;
    this.file = null;
    this.createBrand = false;
    this.id = null;
    this.editBrandData = false;
  }
  showCreate(){
    this.url = null;
    this.file = null;
    this.editBrandData = false;
    this.createBrand = true;
    this.initModule();
  }

  onSubmit(){
    let brand = {
      name: this.dataForm.value.name,
      link: this.dataForm.value.link,
      logo: this.url ? this.url : this.dataForm.value.logo,
    }
    console.log(this.id);
    if(this.id && this.editBrandData){
      let finaldata = {...brand, ...{_id: this.id}};
      console.log(finaldata);
      this.editBrand(finaldata);
    }
    else if(this.dataForm.invalid){
      this.msg.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.msg.create('warning', 'Password Mismatch');
      return
    }else{
      this.addBrand(brand);

    }
  }


  editBrand(data : Brand){
    this.brandService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.msg.create('success', res.message);
        this.reloadService.needRefreshBrands$();
        this.createBrand = false;

      }, err => {
        this.msg.create('error', err.error.message);
      })
  }

  addBrand(data : Brand){
    this.brandService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.msg.create('success', res.message);
        this.hideCreate();
        this.reloadService.needRefreshBrands$();
      }, err => {
        this.msg.create('error', err.error.messase);
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

  async fileChangeEvent(event: any) {
    this.file = (event.target as HTMLInputElement).files[0];
    // File Name Modify...
    const originalNameWithoutExt = this.file.name.toLowerCase().split(' ').join('-').split('.').shift();
    const fileExtension = this.file.name.split('.').pop();
    // Generate new File Name..
    this.newFileName = `${Date.now().toString()}_${originalNameWithoutExt}.${fileExtension}`;

    const reader = new FileReader();
    reader.readAsDataURL(this.file);


    reader.onload = () => {
      // this.imgPlaceHolder = reader.result as string;
    };

    // Open Upload Dialog
    if (event.target.files[0]) {
      await this.openComponentDialog(event);
    }
    // NGX Image Cropper Event..
    this.imageChangedEvent = event;
  }

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
          this.pickedImage = dialogResult.croppedImage;
          this.imgPlaceHolder = this.pickedImage;
          this.imageUploadOnServer();
        }
      }
    });
  }
  imageUploadOnServer() {

    const data: FileData = {
      fileName: this.newFileName,
      file: this.imgBlob,
      folderPath: 'brands'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
      }, error => {
        console.log(error);
      });
  }

  showDeleteConfirm(id): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">All the related datas will be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.delete(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  delete(id){
    this.brandService.deleteById(id)
    .subscribe(res => {
      this.msg.create('success', res.message);
      this.reloadService.needRefreshBrands$();
    }, err=> {
      this.msg.create('error', err.message)
    })
  }

}
