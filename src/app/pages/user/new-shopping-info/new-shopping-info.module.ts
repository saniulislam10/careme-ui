import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewShoppingInfoRoutingModule } from './new-shopping-info-routing.module';
import { NewShoppingInfoComponent } from './new-shopping-info.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MaterialModule } from 'src/app/material/material.module';
import { AddAddressComponent } from './add-new-address/add-address.component';
import { FormsModule } from '@angular/forms';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [NewShoppingInfoComponent, AddAddressComponent],
  imports: [
    CommonModule,
    NewShoppingInfoRoutingModule,
    MatCheckboxModule,
    MaterialModule,
    FormsModule,
    AntModule,
  ],
})
export class NewShoppingInfoModule {}
