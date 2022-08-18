import { Component, Input, OnInit } from '@angular/core';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-card-one',
  templateUrl: './product-card-one.component.html',
  styleUrls: ['./product-card-one.component.scss']
})
export class ProductCardOneComponent implements OnInit {

  @Input() data?:any;
  thumbnailImage: string;
  link: any;
  globalPrice: number;
  globalRate: number = 1;
  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    let images = this.getImages(this.data.medias, this.data.images);
    this.thumbnailImage = images[0];
    this.globalPrice = this.data?.sellingPrice;
    if(this.data.hasLink){
      this.link = "/product-details-search/" + this.data?.slug;
      let url = new URL(this.data.link).hostname;
      this.checkConversionRate(url);
    }else{

      this.link = "/product-details/" + this.data?.slug;
    }

  }


  getImages(medias, images){
    let allMedias = [];
    if(medias.length > 0){
      for(let i =0, x=0;i<medias.length;i++){
        if(medias[i] !==null && medias[i] !==""){
          allMedias.push(medias[i]);
          x++;
        }
      }
      allMedias = [...allMedias, ...images];
    }else{
      allMedias = images;
    }
    return allMedias;
  }

  checkConversionRate(link: any) {
    this.productService.getSpecificConversionRateByUrl(link).subscribe(
      (res) => {
        this.globalRate = res.data;
      },
      (error) => {
        console.log(error);
        this.globalRate = 1;
      }
    );
  }

}
