import { products } from '../../../core/utils/dashboard.data';
import { Invoice } from '../../../interfaces/invoice';
import { InvoiceService } from '../../../services/invoice.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserDataService } from 'src/app/services/user-data.service';
import { FormArray, FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzTimelineMode } from 'ng-zorro-antd/timeline';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/interfaces/order';
import { Subscription } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';
import { Return } from 'src/app/interfaces/return';
import { ReturnService } from 'src/app/services/return.service';
import { OrderStatus } from 'src/app/enum/order-status';
import { ProductService } from 'src/app/services/product.service';



@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {

  listOfChildrenData: any[] = [];
  currentDate : Date = new Date();
  subRouteOne: Subscription;
  id: string;
  invoices: Invoice[] = [];
  index: number;
  data: any;
  mode : NzTimelineMode = 'left';
  isVisibleTop: boolean = false;
  reviewMessage : string;
  reviewForm : FormGroup;
  userId : any;
  productId : any;
  orderNo: any;
  sku: any;
  isVisible : boolean = false;
  loading: boolean = false;
  checked: any;
  returnInvoice: any;
  returnProducts: any[] = [];
  reason: string;
  images: string [] = [];
  notes: string;
  dataForm: FormGroup;
  products: FormArray;
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private invoiceService: InvoiceService,
    private userDataService: UserDataService,
    private reviewService: ReviewService,
    private returnService: ReturnService,
    private msg: NzMessageService,
    private fb: FormBuilder
  ) { }


  ngOnInit(): void {
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      this.getAllInvoiceByOrderId(this.id);
    });

    this.initReviewForm();

    this.getUserInfo();

  }

  getThumbnailImage(data) {
    let images = this.productService.getImages(data.medias, data.images);
    return images[0];
  }

  initReturnForm() {
    this.dataForm = this.fb.group({
      products: this.fb.array([])
    });
    this.products = this.dataForm.get('products') as FormArray;
  }

  getUserInfo(){
    this.userDataService.getLoggedInUserInfo()
    .subscribe(res =>{
      this.userId = res.data._id;
    }, err => {
      this.msg.create('error', err);
    })
  }

  initReviewForm(){
    this.reviewForm = this.fb.group({
      reviewMessage : [null, Validators.required]
    })
  }

  getAllInvoiceByOrderId(id){
    this.invoiceService.getAllInvoicesByOrderNo(id)
    .subscribe( res => {
      this.invoices = res.data;
      console.log(this.invoices)
    }, err => {
      console.log(err);
    })
  }

  setThumbnailImage(data) {
    let images = this.getImages(data?.medias, data?.images);
    return images[0];
  }

  getImages(medias, images) {
    let allMedias = [];
    if (medias && medias.length > 0) {
      for (let i = 0, x = 0; i < medias.length; i++) {
        if (medias[i] !== null && medias[i] !== '') {
          allMedias.push(medias[i]);
          x++;
        }
      }
      allMedias = [...allMedias, ...images];
    } else {
      allMedias = images;
    }
    return allMedias;
  }

  handleOk() {
    if(this.reviewForm.invalid){
      this.msg.create('warning', "Provide your review before submitting");
      return
    }

    let data = {
      user: this.userId,
      product: this.productId,
      rating : 5,
      sku : this.sku,
      orderNo : this.orderNo,
      date : new Date(),
      message : this.reviewForm.value.reviewMessage
    }
    this.reviewService.add(data)
    .subscribe(res => {
      this.msg.create('success', res.message);
    }, err=>{
      this.msg.create('error', err);
    })
    this.productId = null;
    this.orderNo = null;
    this.sku = null;
    this.isVisibleTop = false;
  }

  handleCancel(): void {
    this.isVisibleTop = false;
    this.productId = null;
    this.orderNo = null;
    this.sku = null;

  }
  handleCancelRTD(): void {
    this.isVisible = false;
  }

  handleOkRTD() {
    this.loading = true;
    this.placeReturn(this.returnInvoice, this.dataForm.value.products);

  }

  changeEligibilityRTD() {
    this.checked = !this.checked;
  }

  openReview(sku, id, orderNo){
    this.productId = id;
    this.orderNo = orderNo;
    this.sku = sku;
    this.isVisibleTop = true;
  }

  showReturn(invoice, product){
    this.isVisible = true;
    this.returnInvoice = invoice;
    this.initReturnForm();
    let data = product;
    let newProduct = this.fb.group({
      name: [data.name],
      variant: [data.variant],
      sku: [data.sku],
      quantity: [1, Validators.required],
      totalInvoicedQty: [data.quantity, Validators.required],
      recievedQty: [0],
      recieved: [false],
      price: [data.price],
      tax: [data.tax],
    })
    this.products.push(newProduct);
    this.returnProducts.push(product)

  }

  onChangeQty(i, value, max){
    // this.products[i].value.quantity = 5;
    if(value > max){
      this.products.controls[i].patchValue(
        { quantity : max}
      )
    }else if (value < 1){
      this.products.controls[i].patchValue(
        { quantity : 1}
      )
    }
  }


  placeReturn(invoice, products) {
    let returnId;
    let data = {
      invoiceId: invoice._id,
      orderNumber: invoice.orderNumber,
      returnDate: new Date(),
      customerName: invoice.customerName,
      billingAddress: invoice.billingAddress,
      shippingAddress: invoice.shippingAddress,
      subTotal: invoice.subTotal,
      adjustment: 0,
      deliveryFee: 120,
      deliveryStatus: OrderStatus.PENDING,
      total: invoice.total,
      products: products,
      refundEligible: false,
      reason: this.reason,
      images: this.images,
      notes: this.notes,
    }

    console.log(data);
    this.returnService.placeReturn(data)
      .subscribe(res => {
        returnId = res.returnId
        let message = res.message + ". Return Id: " + res.returnId;
        this.msg.success(message, {
          nzDuration: 10000
        });
          this.loading = false;
          this.isVisible = false;
      }, err => {
        this.msg.create('error', err.message);
      })
    return returnId;
  }

}
