import { UiService } from 'src/app/services/ui.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { UserService } from 'src/app/services/user.service';
import { FileUploadService } from './../../../services/file-upload.service';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileData } from 'src/app/interfaces/file-data';
import { ImageCropperComponent } from 'src/app/shared/components/image-cropper/image-crop.component';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from 'c:/Users/HP/Desktop/Projects/Careme/Care-Me-UI-main/careme-ui/src/app/interfaces/user';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  loading = false;
  avatarUrl?: string;

  //image upload
  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  pickedImage?: any;
  imgPlaceHolder = '/assets/svg/user.svg';
  imageChangedEvent: any = null;
  url: any;

  dataForm: FormGroup;
  userStatus: boolean;
  user: User;




  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private fb: FormBuilder,
    private userService: UserService,
    private userDataService: UserDataService,
    private uiService: UiService
    ) {

    }
  ngOnInit(): void {
    this.dataForm = this.fb.group({
      fullName: [''],
      username: ['', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      gender: [''],
      age: [''],
      zilla: [''],
      city: [''],
      thana: [''],
      zipcode: [''],
      email: ['', [Validators.email]],
      address: [''],
      password: ['', [Validators.required]],
    });

    this.userStatus = this.userService.getUserStatus();

    if(this.userStatus){
      this.userDataService.getLoggedInUserInfo()
      .subscribe(res => {
        console.log(res.data);
        this.user = res.data;
        this.dataForm.patchValue(this.user);
      }, err=> {
        this.uiService.createMessage('error', err);
      })
    }else{
      this.uiService.createMessage('error', 'Please Login First');
    }


  }



  onSubmit(): void {
    const finalData = {...this.dataForm.value, ...{_id: this.user._id}}
    this.userDataService.editLoginUserInfo(finalData)
    .subscribe( res => {
      this.uiService.createMessage('success', 'Profile Updated Successfully');
    }, err => {
      this.uiService.createMessage('error', err);
    })
  }


  /**
   *
   * Image Upload
   */
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
      folderPath: 'tags'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
      }, error => {
        console.log(error);
      });
  }




}
