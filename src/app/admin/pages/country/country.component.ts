import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, EMPTY } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Country } from 'src/app/interfaces/country';
import { FileData } from 'src/app/interfaces/file-data';
import { AdminService } from 'src/app/services/admin.service';
import { CountryService } from 'src/app/services/country.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ImageCropperComponent } from 'src/app/shared/components/image-cropper/image-crop.component';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  createCountry = false;
  editCountryData = false;
  dataForm: FormGroup;
  countrys: Country[] = [];
  id: any;
  subRouteOne: Subscription;
  searchQuery: any;

  @ViewChild('searchForm') searchForm: NgForm;
  holdPrevData: Country[];
  searchCountrys: any[];
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
    private countryService: CountryService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private dialog: MatDialog,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshCountrys$
      .subscribe(() => {
        this.getAllCountrys();
      });
    this.getAllCountrys();

    if(this.createCountry){
      this.initModule();
    }
  }
  getAllCountrys() {
    this.subRouteOne = this.countryService.getAll()
    .subscribe( res => {
      this.countrys = res.data;
      console.log(this.countrys);
      this.holdPrevData = this.countrys;
    }, err => {
      console.log(err);
      this.msg.create('error', err.error.message);
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
    this.url = null;
    this.file = null;
    this.editCountryData = false;
    this.createCountry = false;
    this.id = null;
  }
  showCreate(){
    this.url = null;
    this.file = null;
    this.editCountryData = false;
    this.createCountry = true;
    this.initModule();
  }

  onSubmit(){
    let country = {
      name: this.dataForm.value.name,
      flag: this.url? this.url : this.dataForm.value.flag,
    }
    console.log(this.id);
    if(this.id && this.editCountryData){
      let finaldata = {...country, ...{_id: this.id}};
      console.log(finaldata);
      this.editCountry(finaldata);
    }
    else if(this.dataForm.invalid){
      this.msg.create('warning', 'Please input the required fields');
      return
    }
    else if(this.dataForm.value.password !== this.dataForm.value.confirmPassword){
      this.msg.create('warning', 'Password Mismatch');
      return
    }else{
      this.addCountry(country);
    }
  }


  editCountry(data : Country){
    this.countryService.editById(data)
      .subscribe( res => {
        console.log(res.message);
        this.msg.create('success', res.message);
        this.reloadService.needRefreshCountrys$();
        this.createCountry = false;

      }, err => {
        this.msg.create('error', err.error.message);
      })
  }

  addCountry(data : Country){
    this.countryService.add(data)
      .subscribe( res => {
        console.log(res.message);
        this.msg.create('success', res.message);
        this.reloadService.needRefreshCountrys$();
      }, err => {
        this.msg.create('error', err.error.messase);
      })
  }

  edit(data){
    this.id = data._id;
    this.initModule();
    this.createCountry = true;
    this.editCountryData = true;
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
            return this.countryService.getSearchCountrys(this.searchQuery);
          } else {
            this.countrys = this.holdPrevData;
            this.searchQuery = null;
            return EMPTY;
          }
        })
      )
      .subscribe(
        (res) => {
          this.searchCountrys = res.data;
          this.countrys = this.searchCountrys;
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
    if (this.searchCountrys.length > 0) {
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
    if (this.searchCountrys.length > 0) {
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
    this.searchCountrys = [];
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
    this.countryService.deleteById(id)
    .subscribe(res => {
      this.msg.create('success', res.message);
      this.reloadService.needRefreshCountrys$();
    }, err=> {
      this.msg.create('error', err.message)
    })
  }

}
