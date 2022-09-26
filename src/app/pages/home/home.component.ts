import { CarouselCntrlService } from './../../services/carousel-cntrl.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ProductCardOne } from 'src/app/interfaces/product-card-one';
import { BannerCarousel } from 'src/app/interfaces/banner-carousel';
import { CategoryService } from 'src/app/services/category.service';
import { MenuService } from 'src/app/services/menu.service';
import { CategoryMenu } from 'src/app/interfaces/category-menu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  id: any;
  category: CategoryMenu[] = [];
  constructor(
    private CarouselCntrlService: CarouselCntrlService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.getAllCategoryMenus();
  }
  ngAfterViewInit(): void {}

  carouselData: BannerCarousel[] = [
    {
      _id: '1',
      bannerImage: './assets/images/image/Untitled-2.png',
    },
    {
      _id: '2',
      bannerImage: './assets/images/image/Untitled-2.png',
    },
    {
      _id: '3',
      bannerImage: './assets/images/image/Untitled-2.png',
    },
    {
      _id: '4',
      bannerImage: './assets/images/image/Untitled-2.png',
    },
  ];

  /*** Product Carde One Data */

  cardOneData: any[] = [
    {
      _id: '1',
      medias: ['./assets/images/image/Brush_Holder-min.png'],
      images: ['./assets/images/image/Brush_Holder-min.png'],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '2',
      medias: [
        './assets/images/image/c1b95cc5-d2e3-4cba-87e3-6b646eb7e1ec.png',
      ],
      images: [
        './assets/images/image/c1b95cc5-d2e3-4cba-87e3-6b646eb7e1ec.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '3',
      medias: ['./assets/images/image/shoe.png'],
      images: ['./assets/images/image/shoe.png'],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '4',
      medias: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      images: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
    {
      _id: '5',
      medias: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      images: [
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      ],
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      sellingPrice: 150,
      discount: 200,
    },
  ];

  cardThreeData: ProductCardOne[] = [
    {
      _id: '1',
      image:
        'https://cdn.shopify.com/s/files/1/0464/2281/8974/products/O1CN015QAr4e2Jn1Wi9H9C2__1762329465-0-cib.jpg?v=1662883560',
      title: "Men's Casual Shock Absorption Wear-resistant Shoes",
      routerLink: '/product-details',
      price: 500,
      discount: 690,
    },
    {
      _id: '2',
      image:
        'https://cdn.shopify.com/s/files/1/0464/2281/8974/products/O1CN015QAr4e2Jn1Wi9H9C2__1762329465-0-cib.jpg?v=1662883560',
      title: "Men's Casual Shock Absorption Wear-resistant Shoes",
      routerLink: '/product-details',
      price: 150,
      discount: 278,
    },
    {
      _id: '3',
      image:
        'https://cdn.shopify.com/s/files/1/0464/2281/8974/products/O1CN015QAr4e2Jn1Wi9H9C2__1762329465-0-cib.jpg?v=1662883560',
      title: "Men's Casual Shock Absorption Wear-resistant Shoes",
      routerLink: '/product-details',
      price: 170,
      discount: 300,
    },
    {
      _id: '4',
      image:
        'https://cdn.shopify.com/s/files/1/0464/2281/8974/products/O1CN015QAr4e2Jn1Wi9H9C2__1762329465-0-cib.jpg?v=1662883560',
      title: "Men's Casual Shock Absorption Wear-resistant Shoes",
      routerLink: '/product-details',
      price: 130,
      discount: 139,
    },
    {
      _id: '5',
      image:
        'https://cdn.shopify.com/s/files/1/0464/2281/8974/products/O1CN015QAr4e2Jn1Wi9H9C2__1762329465-0-cib.jpg?v=1662883560',
      title: "Men's Casual Shock Absorption Wear-resistant Shoes",
      routerLink: '/product-details',
      price: 180,
      discount: 300,
    },
  ];

  cardTwoData: ProductCardOne[] = [
    {
      _id: '1',
      image: './assets/images/image/egts.png',
      title: 'Waterproof wireless Headphone',
      routerLink: '/product-details',
      price: 150,
      discount: 299,
    },
    {
      _id: '2',
      image: './assets/images/image/c1b95cc5-d2e3-4cba-87e3-6b646eb7e1ec.png',
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      price: 160,
      discount: 273,
    },
    {
      _id: '3',
      image: './assets/images/image/photo-1517420879524-86d64ac2f339.png',
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      price: 190,
      discount: 399,
    },
    {
      _id: '4',
      image:
        './assets/images/image/nike-air-force-1-07-lv8-lakers-dc8874-101-mood-1.png',
      title: 'Toothbrush & Paste Holder',
      routerLink: '/product-details',
      price: 140,
      discount: 183,
    },
  ];

  /* HTTP REQ */
  private getAllCategoryMenus() {
    this.menuService.getAllCategoryMenuNoRepeat().subscribe((res) => {
      this.category = res.data;
    });
  }
}
