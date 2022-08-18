import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileData } from 'src/app/interfaces/file-data';
import { Tag } from 'src/app/interfaces/tag';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ReloadService } from 'src/app/services/reload.service';
import { TagService } from 'src/app/services/tag.service';
import { UiService } from 'src/app/services/ui.service';
import { ImageCropperComponent } from './image-cropper/image-crop.component';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  dataForm?: FormGroup;
  addTagArea = false;

  //image upload
  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  pickedImage?: any;
  imgPlaceHolder = '/assets/svg/user.svg';
  imageChangedEvent: any = null;

  tags: Tag[] = [];
  // server images
  serverImages: any;
  // image url
  url: any;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
    private tagService: TagService,
    ) { }

  ngOnInit(): void {
    this.initFormGroup();

    this.reloadService.refreshTags$
    .subscribe(() => {
      this.getAllTags();
    });
    this.getAllTags();
  }

  deleteTag(id){
    this.tagService.deleteTag(id)
    .subscribe(res=>{
      this.uiService.success(res.message);
      this.reloadService.needRefreshTags$();

    }, err=>{
    console.log(err);

    })
  }

  private initFormGroup() {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      images: [null]
    });
  }

  // get all size chart
  private getAllTags() {


    this.spinner.show();

    this.tagService.getAllTags()
      .subscribe(res => {
        this.spinner.hide();
        this.tags = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * Submit Form
   */

  onSubmit(){
    this.addTag(this.url);
  }

  addTag(url: any){
    let tag = {
      name: this.dataForm.value.name,
      images: url,
    }

    this.tagService.addTag(tag)
    .subscribe(
    (res) => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshTags$();
    },
    (error) => {
      console.log(error);
    })
  }

  /***
   * Control   addChart
   */
   hideTag(){
    this.addTagArea = false;
  }
  showTag(){
    this.addTagArea= true;
  }

  /**
   * Image upload
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

  /**
   * OPEN COMPONENT DIALOG
   */
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

  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   */

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
