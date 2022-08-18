import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';


// import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { CityService } from 'src/app/services/city.service';
import { City } from 'src/app/interfaces/city';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {


  city: City[] = [];

  constructor(
    private dialog: MatDialog,
    private cityService: CityService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshCity$
      .subscribe(() => {
        this.getAllCity();
      });
    this.getAllCity();
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
        this.deleteCityByCityId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllCity() {
    this.spinner.show();
    this.cityService.getAllCity()
      .subscribe(res => {
        console.log(res);
        this.spinner.hide();
        this.city = res.data;

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteCityByCityId(id: string) {
    this.spinner.show();
    this.cityService.deleteCityByCityId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCity$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


}
