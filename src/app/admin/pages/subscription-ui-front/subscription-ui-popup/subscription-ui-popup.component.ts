import { SubscriptionUiFrontComponent } from './../subscription-ui-front.component';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-ui-popup',
  templateUrl: './subscription-ui-popup.component.html',
  styleUrls: ['./subscription-ui-popup.component.scss']
})
export class SubscriptionUiPopupComponent implements OnInit {
  @ViewChild('file') file!:ElementRef;
  filePath:any;
  popUp = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  /**** attachment file */
  attachmentFile(){
    this.file.nativeElement.click();
  }
  /**** file Change */
  changeFile(file:any){
    this.filePath = file.value;
  }
  /**** hide popUp */
  hidePopUp(){
    this.popUp = false;
  }


}
