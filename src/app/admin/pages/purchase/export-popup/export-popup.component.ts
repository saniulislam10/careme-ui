import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ExportType } from 'src/app/enum/exportType.enum';
import { OrderService } from 'src/app/services/order.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-popup',
  templateUrl: './export-popup.component.html',
  styleUrls: ['./export-popup.component.scss']
})
export class ExportPopupComponent implements OnInit {

  export = false;
  orders: any;
  selectedAmount
  selectedType
  @Output() valueChange = new EventEmitter();
  /* CURRENT_PAGE = 1,
    ALL_ORDERS = 2,
    SELECTED = 3,
    BY_SEARCH_RESULT=4,
    BY_DATE=5 */
  exportTypes=[
    {value:ExportType.CURRENT_PAGE,viewValue:'Current Page'},
    {value:ExportType.ALL_ORDERS,viewValue:'All Products'},
    {value:ExportType.SELECTED,viewValue:'Selected Data : '},
    {value:ExportType.BY_SEARCH_RESULT,viewValue:'Results matching your search'},
    {value:ExportType.BY_DATE,viewValue:'By Date'},
  ]
  constructor(
    private utilsService: UtilsService,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    // this.getAllOrders();
  }

  getAllOrders(){
    this.orderService.getAllOrdersByAdmin()
    .subscribe(res => {
      this.orders = res.data;
    })
  }

  /*** export- pop up */
  exportPOpUpHide(){
    this.export = false;
  }
  exportPOpUpShow(){
    this.export = true;
  }

    /**
   * EXPORTS TO EXCEL
   */
     exportToExcel() {
      const date = this.utilsService.getDateString(new Date());
      // EXPORT XLSX
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.orders);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'products');
      XLSX.writeFile(wb, `Products_${date}.xlsx`);

    }
    onExport(){
      this.valueChange.emit({'selectedAmount':this.selectedAmount,'SelectedType':this.selectedType});
    }
}
