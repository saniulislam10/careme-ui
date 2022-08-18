import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HttpStatusCodeEnum } from 'src/app/enum/http-status-code.enum';
import { Category } from 'src/app/interfaces/category';
import { SubCategory } from 'src/app/interfaces/sub-category';
import { CategoryService } from 'src/app/services/category.service';
import { ReloadService } from 'src/app/services/reload.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  category: Category = null;
  public filteredCatList: Category[];
  subCategory: SubCategory = null;
  autoSlug = true;
  categoryTypes: string[] = ['Parent', 'Child'];
  categories: Category[] = null;
  hasChild: boolean;
  //param
  private sub?: Subscription;
  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private categoryService: CategoryService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private subCategoryService: SubCategoryService,
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit(): void {
    this.initFormGroup();
    this.autoGenerateSlug();
    this.getAllCategories();
    if(this.data){
      this.dataForm.patchValue(this.data);
      if(this.data.parent){
        this.subCategory = this.data;
        this.hasChild= true;
        this.dataForm.value.parent = this.data.parent;
      }else{
        this.category = this.data;
        this.filteredCatList = this.categories.slice();
      }
    }
  }

  /**
   * INIT FORM
   */

   private initFormGroup() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      tags: [null],
      selectedType: [null],
      parent: [null],
      parentName: [null],
    });
  }

  // Get categories

  getAllCategories() {
    this.categoryService.getAllCategory().subscribe(
      (res) => {
        this.spinner.show();
      this.categories = res.data;
      this.filteredCatList = this.categories.slice();
      this.spinner.hide();
      }, (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  /**
   * Auto Slug
   */

   autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm
        .get('name')
        .valueChanges.pipe()
        .subscribe((d) => {
          const res = d
            ?.trim()
            .replace(/[^A-Z0-9]+/gi, '-')
            .toLowerCase();
          this.dataForm.patchValue({
            slug: res,
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  /**
   * Http Params
   */

  // Category Add
  addCategory(data: Category) {
    this.categoryService.addCategory(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
        this.reloadService.needRefreshProduct$();
        this.reloadService.needRefreshCategories$();
      },
      (error) => {
        this.spinner.hide();
        this.uiService.warn(error);
        console.log(error)
      }
    );
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please input all the required data');
      return;
    } else if (
      this.dataForm.value.selectedType === 'Child' &&
      this.dataForm.value.parent === null
    ) {
      this.uiService.warn('Please input parent');
      return;
    } else {
      this.spinner.show();
      const rawData = this.dataForm.value;
      if (this.category) {
        const finalData = {
          ...this.dataForm.value,
          ...{ _id: this.category._id },
        };
        this.editCategory(finalData);
      } else if (this.subCategory) {
        const finalData = {
          ...this.dataForm.value,
          ...{ _id: this.subCategory._id },
        };
        this.editSubCategory(finalData);
      }
      else {
        if (this.dataForm.value.selectedType === 'Parent') {
          this.addCategory(rawData);
        } else {
          this.addSubCategory(rawData);
        }
      }
    }
  }

  //Category Edit
  editCategory(data: Category) {
    this.categoryService.editCategoryData(data).subscribe(
      (res) => {
        this.spinner.hide();
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategories$();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  // Sub Category add
  private addSubCategory(data: SubCategory) {
    this.spinner.show();
    this.subCategoryService.addSubCategory(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.reloadService.needRefreshCategories$();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        if (
          error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT
        ) {
          this.dataForm.controls.subCategoryName.setErrors({ incorrect: true });
        }
      }
    );
  }

  private editSubCategory(data: SubCategory) {
    this.spinner.show();
    this.subCategoryService.editSubCategoryData(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.reloadService.needRefreshCategories$();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        if (
          error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT
        ) {
          this.dataForm.controls.subCategoryName.setErrors({ incorrect: true });
        }
      }
    );
  }

  closeDialogBox(){
    this.dialogRef.close(true);
  }

}
