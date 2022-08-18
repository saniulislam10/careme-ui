import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../interfaces/order';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../../services/order.service';
import {UiService} from '../../../../services/ui.service';
import {OrderStatus} from '../../../../enum/order-status';
import {IAlbum, Lightbox, LightboxConfig} from 'ngx-lightbox';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = null;
  order: Order = null;
  orderStatusEnum = OrderStatus.PENDING;

  albums: IAlbum[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private uiService: UiService,
    private router: Router,
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.getOrderDetails();
    });
  }

  /**
   * MODIFY IMAGES AS ALBUM FOR LIGHTBOX
   */
  private prepareImagesForLightBox() {
    this.albums = this.order.images.map(m => {
      return {
        src: m,
        caption: '',
        thumb: m
      } as IAlbum;
    });
  }

  updatedAmount() {
    let refundAmount = 0;
    this.order.orderedItems.map( item => {
      if (!item.product && item.deleteDeliveryStatus === 'not-shipped-or-delivered') {
        refundAmount += item.price * item.quantity;
      }
    });
    this.order.refundAmount = refundAmount;
  }

  /**
   * HTTP REQ HANDLE
   */

  private getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId)
      .subscribe(res => {
        this.order = res.data;
        if (this.order && this.order.images && this.order.images.length) {
          this.prepareImagesForLightBox();
        }
        this.updatedAmount();
      }, error => {
        console.log(error);
      });
  }


  cancelOrderByUser() {
    this.orderService.cancelOrderByUser(this.orderId)
      .subscribe(res => {
        if (res.status === 1) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
        this.router.navigate(['/account/order-list']);
      }, error => {
        console.log(error);
      });
  }

  /**
   * LIGHT BOX VIEW DIALOG
   */

  openLightBox(index: number): void {
    this.lightboxConfig.showZoom = true;
    this.lightboxConfig.showRotate = true;
    this.lightboxConfig.centerVertically = true;
    this.lightboxConfig.enableTransition = true;
    this.lightbox.open(this.albums, index);
  }

  closeLightBox(): void {
    this.lightbox.close();
  }




}
