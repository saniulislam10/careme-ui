import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryMenu } from 'src/app/interfaces/category-menu';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  //subscriptions
  private subRoute: Subscription;
  products: any[] = [];
  searchQuery: string;
  // CategorManu
  categoryMenu: CategoryMenu[];
  //category
  category: string = null;
  // subcategory
  subCategory: string = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private categoryServce: CategoryService,
    private subCategoryService: SubCategoryService,
    private menuService: MenuService
  ) {}
  ngOnInit(): void {
    this.getCategoryMenu();
    // GET ID FORM PARAM
    this.subRoute = this.activatedRoute.paramMap.subscribe((param) => {
      if (param.get('categorySlug')) {
        this.category = param.get('categorySlug');
        if (param.get('subCategorySlug')) {
          this.subCategory = param.get('subCategorySlug');
        }
      }

      if (this.category && this.subCategory) {
        this.getProductsBySubCategory();
      }
      else if (this.category) {
        this.getProductsByCategory();
      }
    });
  }

  /* HTTP REQ */
  getCategoryMenu() {
    this.menuService.getAllCategoryMenu().subscribe((res) => {
      this.categoryMenu = res.data;
    });
  }
  private getProductsByCategory() {
    let catId: string;
    this.categoryServce
      .getCategoryByCategorySlug(this.category)
      .subscribe((res) => {
        if (res.data) {
          catId = res.data._id;

          this.productService
            .getSpecificProductsByCategoryId(catId)
            .subscribe((res) => {
              this.products = res.data;
            });
        }
      });
  }

  getProductsBySubCategory() {
    let catId: string;
    this.subCategoryService
      .getSubCategoryBySubCategorySlug(this.subCategory)
      .subscribe((res) => {
        catId = res.data._id;
        if (res.data) {
          this.productService
            .getSpecificProductsBySubCategoryId(catId)
            .subscribe((res) => {
              this.products = res.data;
            }, (err)=>{
              console.log(err);
            });
        }
      });
  }
}
