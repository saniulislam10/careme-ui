import { Component, OnInit } from '@angular/core';


import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';

import { Zila } from 'src/app/interfaces/zila';
import { ZilaService } from 'src/app/services/zila.service';


@Component({
  selector: 'app-zila',
  templateUrl: './zila.component.html',
  styleUrls: ['./zila.component.scss']
})
export class ZilaComponent implements OnInit {

  zila: Zila[] = [];

  constructor(
    private dialog: MatDialog,
    private zilaService: ZilaService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshZila$
      .subscribe(() => {
        this.getAllZila();
      });
    this.getAllZila();
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
        this. deleteZilaByZilaId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllZila() {
    this.spinner.show();
    this.zilaService.getAllZila()
      .subscribe(res => {
        console.log(res);
        this.spinner.hide();
        this.zila = res.data;

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteZilaByZilaId(id: string) {
    this.spinner.show();
    this.zilaService.deleteZilaByZilaId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshZila$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }




}
