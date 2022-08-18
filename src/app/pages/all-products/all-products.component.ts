import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { ProductService } from 'src/app/services/product.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { Subscription } from 'rxjs';
import { CategoryMenu } from 'src/app/interfaces/category-menu';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

  // responsive filter
  filterList = false;



 //subscriptions
 private subRoute : Subscription;
 products:any[]=[]
 searchQuery:string;
 // CategorManu
 categoryMenu:CategoryMenu[];
 //category
 category:string=null
 // subcategory
 subCategory:string=null

constructor(
  private activatedRoute:ActivatedRoute,
  private productService:ProductService,
  private categoryServce:CategoryService,
  private subCategoryService:SubCategoryService,
  private menuService:MenuService,
){

}
ngOnInit(): void {
  this.getCategoryMenu();
     // GET ID FORM PARAM
   this.subRoute = this.activatedRoute.paramMap.subscribe((param) => {
     if(param.get('categorySlug')){
     this.searchQuery = param.get('categorySlug');
     this.category = param.get('categorySlug')
     }
     if(param.get('subCategorySlug')){
       this.searchQuery +=" "+ param.get('subCategorySlug');
       this.subCategory = param.get('subCategorySlug')
     }


     if(this.category && this.subCategory){

       this.getProductsBySubCategory();
      }
      else{
       this.getProductsByCategory();
     }
   });
}


/* HTTP REQ */
getCategoryMenu(){
 this.menuService.getAllCategoryMenu()
 .subscribe(res=>{
   this.categoryMenu=res.data;
 })
}
private getProductsByCategory(){
  let catId:string;
  this.categoryServce.getCategoryByCategorySlug(this.category)
  .subscribe(res=>{
    if(res.data){
    catId=res.data._id
    this.productService.getSpecificProductsByCategoryId(catId)
    .subscribe(res=>{
     this.products=res.data;
    })
   }
  })

}

private getProductsBySubCategory(){

 let catId:string;
  this.subCategoryService.getSubCategoryBySubCategorySlug(this.subCategory)
  .subscribe(res=>{
   //  console.log(res.data)
   if(res.data){
    catId=res.data._id
    this.productService.getSpecificProductsBySubCategoryId(catId)
    .subscribe(res=>{
     //  console.log(res.data)
     this.products=res.data;
    })
   }
  })
}

// filter
onclickShowFilterList(){
  this.filterList = true;
}
onclickCloseFilterList(){
  this.filterList = false;
}

  //for progress bar

  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;
  tickInterval = 1;

  getSliderTickInterval(): number | 'auto' {
    if (this.showTicks) {
      return this.autoTicks ? 'auto' : this.tickInterval;
    }

    return 0;
  }

}
