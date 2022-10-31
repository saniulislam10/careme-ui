import { Thana } from './../../../../interfaces/thana';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CityService } from 'src/app/services/city.service';
import { City } from 'src/app/interfaces/city';
import { UiService } from 'src/app/services/ui.service';
import { ReloadService } from 'src/app/services/reload.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ThanaService } from 'src/app/services/thana.service';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {


  city: City[] = [];
  thanas: any[]= [];

  constructor(
    private cityService: CityService,
    private thanaService: ThanaService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private modal: NzModalService,
    private msg: NzMessageService

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

  /**
   * HTTP REQ HANDLE
   */

  private getAllCity() {
    this.spinner.show();
    this.cityService.getAllCity()
      .subscribe(res => {
        this.city = res.data;
        this.city.forEach(m => {
          this.getAllThanaByCityId(m._id);
        })

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private delete(id: string) {
    this.spinner.show();
    this.cityService.deleteCityByCityId(id)
      .subscribe(res => {
        this.msg.success(res.message);
        this.reloadService.needRefreshCity$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  getAllThanaByCityId(cityId: string){
    this.thanaService.getAllThanasByCityId(cityId)
    .subscribe(res => {
      this.thanas.push(res.data);
    }, error => {
      console.log(error);
    });
  }
  getThanas(i){
    return this.thanas[i];
  }


}
