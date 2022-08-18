import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMPTY, Subscription } from 'rxjs';
import { pluck, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HttpStatusCodeEnum } from 'src/app/enum/http-status-code.enum';
import { Category } from 'src/app/interfaces/category';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { SubCategory } from 'src/app/interfaces/sub-category';
import { CategoryService } from 'src/app/services/category.service';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { UiService } from 'src/app/services/ui.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {

  searchCategory: any;
  isFocused = false;
  isOpen = false;
  overlay = false;
  isLoading = false;
  // Form Template Ref
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // sort
  public sortQuery = {createdAt: -1};
  public activeSort = null;

  //param
  private sub?: Subscription;
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;
  private subDataThree?: Subscription;
  private subDataFour?: Subscription;
  private subDataFive?: Subscription;

  addCategoryView = false;

  dataForm?: FormGroup;
  categories: any;
  subCategories: SubCategory[] = null;
  category: Category = null;
  subCategory: SubCategory = null;
  autoSlug = true;
  // category
  selectedType: string = null;
  categoryTypes: string[] = ['Parent', 'Child'];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;
  totalProductsStore = 0;
  // filter
  query = null;

  constructor(
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private categoryService: CategoryService,
    private reloadService: ReloadService,
    private storageService: StorageService,
    private fb: FormBuilder,
    private subCategoryService: SubCategoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // Category
    this.reloadService.refreshCategories$
    .subscribe(()=>{
      this.getAllCategories();
      this.getAllSubCategories();
    });

    this.getAllCategories();
    this.getAllSubCategories();

    // Auto Generate Slug
    this.autoGenerateSlug();
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
        // this.templateForm.resetForm();
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
        // this.templateForm.resetForm();
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

  // Get categories

  getAllCategories() {

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.categoryService.getCategorysByDynamicSort(pagination, this.sortQuery, this.query)
    .subscribe((res) => {
      this.categories = res.data;
    },
    (error) => {
      this.spinner.hide();
      console.log(error);
    });
  }

  // Get Sub Categories

  getAllSubCategories() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.subCategoryService.getSubCategorysByDynamicSort(pagination, this.sortQuery, this.query)
    .subscribe(
      (res) => {
        this.subCategories = res.data;
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  /**
   * Submit Form
   */

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
      } else {
        if (this.dataForm.value.selectedType === 'Parent') {
          this.addCategory(rawData);
        } else {
          this.addSubCategory(rawData);
        }
      }
    }
  }

  /**
   * COMPONENT DIALOG VIEW
   */
   public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCategory(data);
      }
    });
  }
  public openConfirmSubDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteSubCategory(data);
      }
    });
  }

  /**
   * DELETE METHOD HERE
   */
   private deleteCategory(id: string) {
    this.categoryService.deleteCategory(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategories$();
      }, error => {
        console.log(error);
      });
  }
  private deleteSubCategory(id: string) {
    this.subCategoryService.deleteSubCategory(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategories$();
      }, error => {
        console.log(error);
      });
  }

  /****
   * controll add category hide show
   *
   */

  showAddCategory() {
    this.addCategoryView = true;
  }
  hideAddCategory() {
    this.addCategoryView = false;
  }

  openAddCategoryDialog(){
    const dialogRef = this.dialog.open(AddCategoryComponent);
  }
  openEditCategoryDialog(category){
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      data: category

    });
  }


  /**
   * SORTING
   */
   sortData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllCategories();
  }

  sortSubData(query: any, type: number) {
    this.sortQuery = query;
    this.activeSort = type;
    this.getAllSubCategories();
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchCategory.length > 0) {
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
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchCategory.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  ngAfterViewInit(): void {
    // this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data.trim();
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchCategory = [];
          this.query = null;
          this.getAllCategories();
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        const filter = {productVisibility: true};
        return this.categoryService.getCategoriesBySearch(data, pagination, filter);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.categories = res.data;
        this.searchCategory=res.data;
        if (this.searchCategory.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.isLoading = false;
      });
  }


}
