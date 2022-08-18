import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';


import { Thana } from 'src/app/interfaces/thana';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { ThanaService } from 'src/app/services/thana.service';


@Component({
  selector: 'app-thana',
  templateUrl: './thana.component.html',
  styleUrls: ['./thana.component.scss']
})
export class ThanaComponent implements OnInit {



  thana: Thana[] = [];

  constructor(
    private dialog: MatDialog,
    private thanaService: ThanaService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshThana$
      .subscribe(() => {
        this.getAllThana();
      });
    this.getAllThana();
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
        this.deleteThanaByThanaId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllThana() {
    this.spinner.show();
    this.thanaService.getAllThana()
      .subscribe(res => {
        console.log(res);
        this.spinner.hide();
        this.thana = res.data;

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteThanaByThanaId(id: string) {
    this.spinner.show();
    this.thanaService.deleteThanaByThanaId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshThana$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }



}
