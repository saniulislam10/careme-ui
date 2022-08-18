import { Component, OnInit } from '@angular/core';
import {Category} from "../../../interfaces/category";
import {CategoryService} from "../../../services/category.service";
import {SizeChart} from "../../../interfaces/size-chart";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SizeChartService} from "../../../services/size-chart.service";
import {UiService} from "../../../services/ui.service";
import {ReloadService} from "../../../services/reload.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Pagination} from "../../../interfaces/pagination";
import { MatDialog } from '@angular/material/dialog';
import { ImageCropperComponent } from './image-cropper/image-crop.component';
import { FileData } from 'src/app/interfaces/file-data';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { SubCategory } from 'src/app/interfaces/sub-category';
import { Product } from 'src/app/interfaces/product';

@Component({
  selector: 'app-size-chart',
  templateUrl: './size-chart.component.html',
  styleUrls: ['./size-chart.component.scss']
})
export class SizeChartComponent implements OnInit {

  imageChangedEvent: any = null;
  addChart = false;
  parentId: string;
  allFilteredProducts: Product[] = [];

  sizeChartPerPage: SizeChart[] = [];
  holdPrevData: SizeChart[] = [];

  // Selected Data
  selectedIds: string[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 10;
  totalProductsStore = 0;

  sizeChart: SizeChart = null;
  id: any;

  // dataform
  dataForm?: FormGroup;

  // server images
  serverImages: any;

  //category
  categories: Category[] = null;
  subCategories: SubCategory[] = null;

  images: any;

  // image url
  url: any;

  //image upload
  file: any = null;
  newFileName: string;
  imgBlob: any = null;
  pickedImage?: any;
  imgPlaceHolder = '/assets/svg/user.svg';

  constructor(
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private fb: FormBuilder,
    private sizeChartService: SizeChartService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
    this.initFormGroup();

    this.reloadService.refreshSizeChart$
    .subscribe(() => {
      this.getAllSizeChart();
    });
    this.getAllSizeChart();

  }

  /**
   * INIT FORM
   */

  private initFormGroup() {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      images: [null],
      parentCategory: [null],
      childCategory: [null],
      products: [null]
    });


  }

  onDeleteSizeChart(id){
    this.sizeChartService.deleteSizeChart(id)
    .subscribe(res=>{
      this.uiService.success(res.message);
      this.reloadService.needRefreshSizeChart$();
    },
    err=>{
      console.log(err)
    })
  }


  /**
   * On Submit
   * @private
   */
  private onSubmit() {
    this.dataForm.value.images = this.url;
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    if(this.id){
      this.editSizeChart(this.url);
    }else{
      this.addSizeChart(this.url);
    }

  }

  editSizeChart(url){
    let sizeChart = {
      _id: this.id,
      name: this.dataForm.value.name,
      parentCategory: this.dataForm.value.parentCategory,
      childCategory: this.dataForm.value.childCategory,
      images: url,
    }
    this.sizeChartService.editSizeChart(sizeChart)
    .subscribe(res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshSizeChart$();
    }, error => {
      this.uiService.warn(error);
      console.log(error);
    })
  }

  onEdit(data){
    this.id = data._id;
    this.showAddChart();
    this.dataForm.patchValue(data);
  }



  /***
   * Control   addChart
   */
  hideAddChart(){
    this.id = null;
    let d = {
      name: '',
      parentCategory: '',
      childCategory: '',
      images: '',
    }
    this.dataForm.patchValue(d);
    this.addChart = false;
  }
  showAddChart(){
    this.addChart= true;
  }



/**
   * HTTP REQ HANDLE
   */

// Get categories

getAllCategories () {
  this.categoryService.getAllCategory()
    .subscribe( res => {
      this.categories = res.data;
    })
}

// Get Sub categories


private getAllSubCategoryByCategoryId(id) {
  this.spinner.show();
  this.subCategoryService.getSubCategoryByCategoryId(id)
    .subscribe(res => {
      this.subCategories = res.data;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
}


  // get all size chart
  private getAllSizeChart() {


    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.sizeChartService.getAllSizeChart(pagination)
      .subscribe(res => {
        this.spinner.hide();
        this.sizeChartPerPage = res.data;

        if (this.sizeChartPerPage && this.sizeChartPerPage.length) {
          this.sizeChartPerPage.forEach((m, i) => {
            const index = this.selectedIds.findIndex(f => f === m._id);
            this.sizeChartPerPage[i].select = index !== -1;
          });
          this.holdPrevData = res.data;
          this.totalProducts = res.count;
          this.totalProductsStore = res.count;

        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
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
      width: '680px',
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
      folderPath: 'users'
    };
    this.fileUploadService.uploadSingleImage(data)
      .subscribe(res => {
        this.url = res.downloadUrl;
        // this.sendUrl(res.downloadUrl);
      }, error => {
        console.log(error);
      });
  }

  addSizeChart(url: any){
    let sizeChart = {
      name: this.dataForm.value.name,
      parentCategory: this.dataForm.value.parentCategory,
      childCategory: this.dataForm.value.childCategory,
      images: url,
    }
    this.sizeChartService.addSizeChart(sizeChart)
    .subscribe(res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshSizeChart$();
    }, error => {
      this.uiService.warn(error);
      console.log(error);
    })
  }


  /**
   * On select category
   */

   onSelectCategory(event){
     this.parentId = event.value;
    this.getAllSubCategoryByCategoryId(event.value);
   }

   onSelectSubCategory(event){
     this.getProductsByCategoryAndSubCategoryId(this.parentId, event.value);
   }

   getProductsByCategoryAndSubCategoryId(parent, child){
     let data = {
       parent: parent,
       child: child
     }
    this.sizeChartService.getSizeChartByParentAndChildCategoryId(data)
    .subscribe(res=>{
      this.allFilteredProducts = res.data;
    }, err =>{
      console.log(err)
    });
   }




}
