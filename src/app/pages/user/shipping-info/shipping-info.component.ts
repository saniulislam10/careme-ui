import { Subscription } from 'rxjs';
import { AddNewAdressComponent } from '../../../shared/components/add-new-adress/add-new-adress.component';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { UserDataService } from 'src/app/services/user-data.service';
import { User } from 'src/app/interfaces/user';
import { Address } from 'src/app/interfaces/address';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { DATABASE_KEY } from 'src/app/core/utils/global-variable';
import { UiService } from 'src/app/services/ui.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { AddAddressComponent } from './add-address/add-address.component';

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class ShippingInfoComponent implements OnInit,AfterViewInit, OnDestroy {
  @ViewChild('address') address:AddNewAdressComponent;

  user: User;
  addressInfo : Address[] = [];
  selectedAddress : any;
  clickActive = [];
  private subReload: Subscription;
  private subAddress: Subscription;

  constructor(
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private storageService: StorageService,
    private uiService: UiService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  openDialog() {
    this.dialog.open(AddAddressComponent);
  }

  ngOnInit(): void {

    this.reloadService.refreshAddress$
    .subscribe(() => {
      this.getUserAddress();
    });
    this.getUserAddress();
  }
  ngAfterViewInit(): void {

  }

  /**
   * Http Req
   */

   private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
    .subscribe(res => {
      this.addressInfo = res.data;
      }, err => {
        console.log(err);
      });
  }

  deleteAddress(index){
    this.userDataService.deleteAddress(this.addressInfo[index]._id)
      .subscribe(res => {
        console.log(res.message);
        this.reloadService.needRefreshAddress$();
      }, err => {
        console.log(err);
      });
  }

  editAddress(data: Address){
    const dialogRef = this.dialog.open(AddAddressComponent, {
      data
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.clickActive = [];
      this.storageService.removeSessionData(DATABASE_KEY.selectedShippingAddress);
      this.selectedAddress = null;
    });
  }

  onSelectAddress(address, i){
    this.selectedAddress = address;
    this.storageService.storeDataToSessionStorage(DATABASE_KEY.selectedShippingAddress, this.selectedAddress);
    this.clickActive = [];
    this.clickActive[i] = true;
  }

  /**
   * On Submit
   */
  onSubmitSelectedAddress(){

    if(this.selectedAddress){
      this.router.navigate([environment.appBaseUrl, 'delivery-info']);
    }else{
      this.uiService.warn("Please Select an Address");
    }
  }



  /***
   * Show popup
   */
  // showPupUp(){
  //   this.address.showPopUp(this.selectedAddress);
  // }

  ngOnDestroy(): void {
    if(this.subReload){
      this.subReload.unsubscribe()
    }
    // this.subAddress.unsubscribe();

  }


}
