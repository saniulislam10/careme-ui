import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditOrderRoutingModule } from './edit-order-routing.module';
import { EditOrderComponent } from './edit-order.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaterialModule } from 'src/app/material/material.module';
import { PipesModule } from 'src/app/shared/pipes/pipes.module';
import { AntModule } from 'src/app/material/ant.module';

@NgModule({
  declarations: [EditOrderComponent],
  imports: [
    CommonModule,
    EditOrderRoutingModule,
    MaterialModule,
    PipesModule,
    MatFormFieldModule,
    FormsModule,
    PipesModule,
    AntModule,
  ],
})
export class EditOrderModule {}
