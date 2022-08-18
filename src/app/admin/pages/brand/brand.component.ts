import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReloadService } from 'src/app/services/reload.service';
import { UiService } from 'src/app/services/ui.service';
import { AddBrandComponent } from './add-brand/add-brand.component';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * COMPONENT DIALOG VIEW
   */
   public openDialog(data?: string) {
    const dialogRef = this.dialog.open(AddBrandComponent, {

    });
    // dialogRef.afterClosed().subscribe(dialogResult => {

    // });
  }

}
