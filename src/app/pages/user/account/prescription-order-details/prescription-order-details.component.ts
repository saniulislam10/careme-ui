import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {IAlbum, Lightbox, LightboxConfig} from 'ngx-lightbox';
import {PrescriptionOrderService} from '../../../../services/prescription-order.service';
import {PrescriptionOrder} from '../../../../interfaces/prescription-order';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FileUploadService} from '../../../../services/file-upload.service';

@Component({
  selector: 'app-prescription-order-details',
  templateUrl: './prescription-order-details.component.html',
  styleUrls: ['./prescription-order-details.component.scss']
})
export class PrescriptionOrderDetailsComponent implements OnInit {
  orderId: string = null;
  order: PrescriptionOrder = null;

  albums: IAlbum[] = [];

  constructor(
    private route: ActivatedRoute,
    private orderService: PrescriptionOrderService,
    private uiService: UiService,
    private router: Router,
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig,
    private dialog: MatDialog,
    private fileUploadService: FileUploadService
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
      }, error => {
        console.log(error);
      });
  }


  cancelOrderByUser() {
    this.orderService.cancelOrderByUser(this.orderId)
      .subscribe(res => {
        if (res.success) {
          this.uiService.success(res.message);
          const fileUrls = this.order.images;
          this.fileUploadService.removeFileMultiArray(fileUrls)
            .subscribe(res2 => {
              this.router.navigate(['/account/prescription-order-list']);
            }, error => {
              this.router.navigate(['/account/prescription-order-list']);
              console.log(error);
            });
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        console.log(error);
      });
  }


  /**
   * COMPONENT DIALOg
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this prescription order?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.cancelOrderByUser();
      }
    });
  }


}
