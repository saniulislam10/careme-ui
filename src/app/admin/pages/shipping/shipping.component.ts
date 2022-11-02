import { ReloadService } from 'src/app/services/reload.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ShippingProfile } from './../../../interfaces/shipping-profile';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ShippingService } from './../../../services/shipping.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
})
export class ShippingComponent implements OnInit {
  checkedAll = false;
  tabs = ['All Invoice', 'Closed', 'Pending'];
  listOfOption: Array<{ label: string; value: string }> = [];
  listOfTagOptions = [];
  profiles: ShippingProfile[] = [];
  constructor(
    private shippingService : ShippingService,
    private msg : NzMessageService,
    private modal : NzModalService,
    private reloadService : ReloadService,
  ) {}

  ngOnInit(): void {
    this.reloadService.refreshShippingProfile$
      .subscribe(() => {
        this.getAllProfile();
      });
    this.getAllProfile();
  }
  getAllProfile(){
    this.shippingService.getAllProfile()
    .subscribe(res => {
      console.log(res.data);
      this.profiles = res.data;
    }, err=> {
      this.msg.error(err.message);
    })
  }

  showDeleteConfirm(id): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this task?',
      nzContent:
        '<b style="color: red;">All the related datas will be deleted</b>',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.delete(id);
      },
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  delete(id){
    this.shippingService.deleteProfileById(id)
    .subscribe(res => {
      this.msg.success(res.message);
      this.reloadService.needRefreshShippingProfile$();
    }, err => {
      this.msg.error(err.message);

    })
  }
}
