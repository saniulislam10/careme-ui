import {Component, Inject, OnInit} from '@angular/core';
import {UserDataService} from '../../../services/user-data.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UtilsService} from '../../../services/utils.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {


  constructor(
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<DialogBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {

  }

  onClose(): void {
    this.dialogRef.close();
  }

}
