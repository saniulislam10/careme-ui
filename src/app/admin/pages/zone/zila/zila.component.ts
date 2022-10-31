import { ThanaService } from './../../../../services/thana.service';
import { Thana } from 'src/app/interfaces/thana';
import { City } from './../../../../interfaces/city';
import { CityService } from './../../../../services/city.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';

import { Zila } from 'src/app/interfaces/zila';
import { ZilaService } from 'src/app/services/zila.service';

@Component({
  selector: 'app-zila',
  templateUrl: './zila.component.html',
  styleUrls: ['./zila.component.scss'],
})
export class ZilaComponent implements OnInit {
  // Tab Data
  countryName = [
    'Bangladesh',
    'Others'
  ];

  zila: Zila[] = [];
  // city: City[];
  cityCount: number;
  // thana: Thana[];
  thanaCount: number;


  constructor(
    private dialog: MatDialog,
    private zilaService: ZilaService,
    private cityService: CityService,
    private thanaService: ThanaService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshZila$.subscribe(() => {
      this.getAllZila();
    });
    this.getAllZila();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllZila() {
    this.spinner.show();
    this.zilaService.getAllZila().subscribe(
      (res) => {
        console.log(res);
        this.spinner.hide();
        this.zila = res.data;

      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }


  /**
   * DELETE METHOD HERE
   */
  private delete(id: string) {
    this.spinner.show();
    this.zilaService.deleteZilaByZilaId(id).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshZila$();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  showDeleteConfirm(id): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent: '<b style="color: red;">All the related datas will be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.delete(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }
}
